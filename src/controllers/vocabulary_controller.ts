import Boom from "boom";
import { ResponseToolkit, Request } from "hapi";
import { ErrorCodes } from "../const/error_codes";

import { UserCourseEntity } from "../entities/user_course_entity";
import { UserEntity } from "../entities/user_entity";
import { WordEntity } from "../entities/word_entity";


import { ProfileRepository } from "../repositories/profile_repository";
import { UserCourseRepository } from "../repositories/user_course_repository";
import { UserRepository } from "../repositories/user_repository";
import { WordRepository } from "../repositories/word_repository";
import { UserService } from "../services/user_service";
import { ProfileService } from "../services/profile_service";
import { UserCourseService } from "../services/user_course_service";

import { WordService } from "../services/word_service";

import { TopicEntity } from "../entities/topic_entity";
import { TopicService } from "../services/topic_service";
import { IRequest } from "../interfaces/request";
import { validateToken } from "../const/validation/validate_auth";
import { IValidateToken } from "../interfaces/validate_token";
import { JwtPayload } from './../socket/socket';
import { UserCourseController } from "./user_course_controller";
import { getProgressForVocabulary } from "../const/common";
import { VocabularyEntity } from "../entities/vocabulary_entity";
import { VocabularyService } from "../services/vocabulary_service";
import { VocabularyWordEntity } from "../entities/vocabulary_word_entity";
import { VocabularyWordService } from "../services/vocabulary_word_service";
import { IInsertKnownWords } from "../interfaces/requests/insert_known_words_request";


export class VocabularyController {

    public static async getKnownWordsByTopic(request: IRequest, response: ResponseToolkit) {
        const { topicName } = request.params as { topicName: string };


        try {


            const userId: string = request.auth.credentials.userId;
            if (!topicName) {
                return Boom.badRequest(ErrorCodes.ERROR_EMPTY_TOPIC)
            }

            if (!userId) {
                return Boom.badRequest(ErrorCodes.ERROR_MISSING_USER_ID);
            }

            const user: UserEntity = await UserService.getUserById(userId);
            if (!user) {

                return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);

            }


            const userCourse: UserCourseEntity = user.profile.userCourse;

            const topic: TopicEntity = await TopicService.getTopicByName(topicName);
            if (!topic) {
                return Boom.badRequest(ErrorCodes.ERROR_TOPIC_DOES_NOT_EXIST);
            }
            const vocabulary: VocabularyEntity = userCourse.mode.vocabulary
            if (!vocabulary) {
                return Boom.badRequest(ErrorCodes.ERROR_USER_DIDNT_CHOOSE_ANY_COURSE)
            }
            const result = await VocabularyWordService.getVocabularyWordsByIdAndTopic(vocabulary, topic);

            let knownWords = result.map((result: any) => ({

                wordId: result.wordId,
                question: result.question,
                answer: result.answer,

            }));



            return response.response({ knownWords }).code(200)


        } catch (error) {
            console.log(error);
            return Boom.badImplementation();

        }
    }
    public static async getKnownWords(request: IRequest, response: ResponseToolkit) {
        const userId: string = request.auth.credentials.userId;
        try {


            if (!userId) {
                return Boom.badRequest(ErrorCodes.ERROR_MISSING_USER_ID);
            }
            const user: UserEntity = await UserService.getUserById(userId);
            if (!user) {

                return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);

            }

            const userCourse: UserCourseEntity = user.profile.userCourse

            const vocabualry: VocabularyEntity = userCourse.mode.vocabulary;
            if (!vocabualry) {
                return Boom.badImplementation();
            }
            const result = await VocabularyWordService.getKnownWordsForQuiz(userCourse.mode.vocabulary.id,user);

            let knownWords = result.map((result: any) => ({

                wordId: result.wordId,
                question: result.question,
                answer: result.answer,

            }));



            return response.response({ knownWords, }).code(200)


        } catch (error) {
            console.log(error);
            return Boom.badImplementation();

        }


    }

    public static async insertKnownWords(request: IInsertKnownWords, response: ResponseToolkit) {
        const payload = request.payload;
        try {
            const userId: string = request.auth.credentials.userId;

            if (!userId) {
                return Boom.badRequest(ErrorCodes.ERROR_MISSING_USER_ID);
            }

            const user: UserEntity = await UserService.getUserById(userId);
            if (!user) {

                return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);

            }
            const words: WordEntity[] = [];
            for (const element of payload.wordIdList) {
                let word = await WordService.getWordById(element);

                if (!word) {
                    return Boom.badRequest(ErrorCodes.ERROR_INVALID_WORD_ID);
                }
                words.push(word);
            }


            const userCourse: UserCourseEntity = user.profile.userCourse;


            const vocabulary = userCourse.mode.vocabulary
            for await (const word of words) {
                const vocabularyWord = new VocabularyWordEntity();
                vocabularyWord.word = word;
                if (!vocabulary) {
                    return Boom.badImplementation();
                }

                vocabularyWord.vocabulary = vocabulary;
                const existingBeginnerWord = await VocabularyWordService.existingVocabularyWord(vocabularyWord);
                if (existingBeginnerWord) {
                    return Boom.badRequest(ErrorCodes.ERROR_USER_ALREADT_KNOW_THIS_WORD)
                }
                await VocabularyWordService.save(vocabularyWord);

            }

            return response.response({ "message": "Success", "insertedWords": words.length, }).code(200)


        } catch (error) {
            console.log(error);
            return Boom.badImplementation();


        }

    }

}