import { Request, ResponseToolkit } from 'hapi';
import { WordEntity } from '../entities/word_entity';

import { ErrorCodes } from '../const/error_codes';
import { UserCourseRepository } from '../repositories/user_course_repository';
import { UserRepository } from '../repositories/user_repository';
import { UserEntity } from '../entities/user_entity';
import { InterfaceLanguageRepository } from '../repositories/interface_language_repository';
import { CourseRepository } from '../repositories/course_repository';
import { CourseEntity } from '../entities/course_entity';
import { InterfaceLanguageEntity } from '../entities/interface_language';
import { TopicEntity } from '../entities/topic_entity';
import Boom from 'boom';
import { TopicRepository } from '../repositories/topic_repository';
import { ProfileRepository } from '../repositories/profile_repository';
import { WordService } from '../services/word_service';
import { TopicService } from '../services/topic_service';
import { UserService } from '../services/user_service';
import { ProfileService } from '../services/profile_service';
import { UserCourseService } from '../services/user_course_service';
import { InterfaceLanguageService } from '../services/interface_language_service';
import { IRequest } from '../interfaces/request';

export class WordController {

  public static async getAllWords(request: Request, response: ResponseToolkit) {
    try {
      const words: WordEntity[] = await WordService.getAllWords();
      return { wordList: words };
    } catch (error) {
      console.log(error);
    }

  }
  
  public static async getWordsByTopic(request: Request, response: ResponseToolkit) {
    const { topicName } = request.params as { topicName: string }
    if (!topicName) {

      return Boom.badRequest(ErrorCodes.ERROR_EMPTY_TOPIC);
    }

    const topic: TopicEntity = await TopicService.getTopicByName(topicName);
    if (!topic) {
      return Boom.badRequest(ErrorCodes.ERROR_TOPIC_DOES_NOT_EXIST);
    }

    const words: WordEntity[] = await WordService.getWordsWithTopic(topic);

    if (words.length == 0) {
      return response.response(ErrorCodes.ERROR_TOPIC_DOES_NOT_EXIST).code(404);

    }

    return { wordList: words };
  }

  public static async createFlashCards(request: IRequest, response: ResponseToolkit) {
    const userId: string = request.auth.credentials.userId;
    const { topicName, } = request.params as { topicName: string, };
    try {
      if (!topicName || !userId) {

        return Boom.badRequest(ErrorCodes.ERROR_PARAMETERS_CANNOT_BE_EMPTY);
      }

      if (!userId) {
        return Boom.badRequest(ErrorCodes.ERROR_MISSING_USER_ID);
      }

      const user: UserEntity = await UserService.getUserById(userId);
  
      if (!user) {

        return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);
      }




      const topic = await TopicService.getTopicByName(topicName);
      if (!topic) {
        return Boom.badRequest(ErrorCodes.ERROR_TOPIC_DOES_NOT_EXIST);
      }



      const userCourse = user.profile.userCourse;
      const wordList = await WordService.getFlashCards(topic, userCourse);


      return response.response({ wordList });
    } catch (error) {
      console.log(error);
    }

  }

  public static async getWordsForVocabularyQuiz(request: IRequest, response: ResponseToolkit) {
    const { topicName } = request.params as { topicName: string, };


    const userId: string = request.auth.credentials.userId;
    try {
      if (!userId || !topicName) {

        return response.response(ErrorCodes.ERROR_PARAMETERS_CANNOT_BE_EMPTY)
      }

      if (!userId) {
        return Boom.badRequest(ErrorCodes.ERROR_MISSING_USER_ID);
      }

      const user: UserEntity = await UserService.getUserById(userId);
      if (!user) {
        return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST)
      }

      const topic: TopicEntity = await TopicService.getTopicByName(topicName);
      if (!topic) {


        return Boom.badRequest(ErrorCodes.ERROR_TOPIC_DOES_NOT_EXIST);
      }



      const userCourse = user.profile.userCourse;

      const wordList = await WordService.getFlashCards(topic, userCourse);
      if (wordList.length == 0) {
        return response.response(ErrorCodes.ERROR_TOPIC_DOES_NOT_EXIST).code(404);
      }

      return { wordList };

    } catch (error) {
      console.log(error);
    }




  }

}
