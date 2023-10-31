import { DataSource, EntityRepository, Int32, Repository } from 'typeorm';
import { dataSource } from '..';
import { WordEntity } from '../entities/word_entity';
import { UserCourseEntity } from '../entities/user_course_entity';
import { TopicEntity } from '../entities/topic_entity';


export class WordRepository {


   public static async getWords(): Promise<WordEntity[]> {
      return dataSource.getRepository(WordEntity).find({
         relations: {
            topic: true,
         }
      });
   }
   public static async getWordById(id: number): Promise<any> {
      return dataSource.getRepository(WordEntity).findOneBy({ id: id })

   }

   public static async getWordsWithTopic(topic: TopicEntity): Promise<any> {
      return dataSource.getRepository(WordEntity).createQueryBuilder()
         .select('word')
         .from(WordEntity, 'word')
         .where('word.topic = :topic', { topic: topic.id })
         .getMany();

   }
   public static async getFlashCards(topic: TopicEntity, userCourse: UserCourseEntity): Promise<any> {
      return dataSource.getRepository(WordEntity)
         .createQueryBuilder('word')
         .select('word.id', 'wordId')
         .addSelect(`word.${userCourse.interfaceLanguage.name}`, 'question')
         .addSelect(`word.${userCourse.course.name}`, 'answer')
         .where('word.topic = :topic', { topic: topic.id })
         .getRawMany();
   }
  
}
