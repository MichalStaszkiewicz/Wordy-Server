import { dataSource } from "..";

import { CourseEntity } from "../entities/course_entity";
import { InterfaceLanguageEntity } from "../entities/interface_language";
import { TopicEntity } from "../entities/topic_entity";
import { UserEntity } from "../entities/user_entity";
import { VocabularyEntity } from "../entities/vocabulary_entity";
import { VocabularyWordEntity } from "../entities/vocabulary_word_entity";
import { WordEntity } from "../entities/word_entity";

export class VocabularyWordRepository {
    public static async save(vocabularyWord: VocabularyWordEntity) {
        return dataSource.getRepository(VocabularyWordEntity).save(vocabularyWord);
    }


    public static async getVocabularyWordsByIdAndTopic(vocabulary: VocabularyEntity, topic: TopicEntity): Promise<VocabularyWordEntity[]> {
        return dataSource.getRepository(VocabularyWordEntity)
            .createQueryBuilder('vocabulary_word')
            .select('vocabulary_word')
            .leftJoinAndSelect('vocabulary_word.word', 'word')
            .where('vocabulary_word.vocabularyId = :vocabularyId', { vocabularyId: vocabulary.id })
            .andWhere('word.topic = :topic', { topic: topic.id })
            .getMany();


    }

    public static async getKnownWordsByTopic(vocabularyId: number, interfaceLanguage: InterfaceLanguageEntity, course: CourseEntity, topic: TopicEntity): Promise<any> {

        return dataSource
            .getRepository(VocabularyWordEntity)
            .createQueryBuilder('vocabulary_word')
            .select('vocabulary_word.id', 'id')
            .leftJoinAndSelect('vocabulary_word.word', 'word')
            .addSelect('word.id', 'word_id')
            .addSelect(`word.${interfaceLanguage.name}`, 'question')
            .addSelect(`word.${course.name}`, 'answer')
            .leftJoin('word.topic', 'topic')
            .where('vocabulary_word.vocabulary = :vocabularyId', { vocabularyId })
            .andWhere('topic.id = :topicId', { topicId: topic.id })
            .getRawMany();

    }
    public static async getKnownWords(vocabulary: VocabularyEntity): Promise<any> {
        return dataSource.getRepository(VocabularyWordEntity).find({
            where: {
                vocabulary: vocabulary
            },
            relations: {
                word: {
                    topic: true,
                }
            }
        })

    }
    public static async getKnownWordsForQuiz(vocabularyId: number, user: UserEntity): Promise<VocabularyWordEntity[]> {

        return await dataSource
            .getRepository(VocabularyWordEntity)
            .createQueryBuilder('vocabulary_word')
            .select('vocabulary_word.id', 'id')
            .leftJoinAndSelect('vocabulary_word.word', 'word')
            .addSelect('word.id', 'wordId')
            .addSelect(`word.${user.profile.settings.interfaceLanguage.name}`, 'question')
            .addSelect(`word.${user.profile.userCourse.course.name}`, 'answer')
            .where('vocabulary_word.vocabulary = :vocabularyId', { vocabularyId })
            .getRawMany();


    }

    public static async existingVocabularyWord(vocabularyWord: VocabularyWordEntity): Promise<any> {

        return dataSource.getRepository(VocabularyWordEntity).findOne({
            where: {
                word: vocabularyWord.word,
                vocabulary: vocabularyWord.vocabulary

            }
        })

    }



}