import { DataSource, EntityRepository, Int32, Repository } from 'typeorm';
import { dataSource } from '..';
import { WordEntity } from '../entities/word_entity';
import { UserCourseEntity } from '../entities/user_course_entity';
import { TopicEntity } from '../entities/topic_entity';
import { WordRepository } from '../repositories/word_repository';


export class WordService {


    public static async getAllWords(): Promise<WordEntity[]> {
        return WordRepository.getWords()
    }
    public static async getWordById(id: number): Promise<any> {
        return WordRepository.getWordById(id);

    }

    public static async getWordsWithTopic(topic: TopicEntity): Promise<WordEntity[]> {
        return WordRepository.getWordsWithTopic(topic);
    }

    
    public static async getFlashCards(topic: TopicEntity, userCourse: UserCourseEntity): Promise<any> {
        return WordRepository.getFlashCards(topic, userCourse,);
    }

}
