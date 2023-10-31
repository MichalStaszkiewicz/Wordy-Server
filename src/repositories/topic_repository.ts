import { dataSource } from "..";
import { TopicEntity } from "../entities/topic_entity";

export class TopicRepository {

    public static async getTopicById(id: number): Promise<any> {

        return dataSource.getRepository(TopicEntity).findOne({
            where: {

                id: id
            }
        })

    }
    public static async getTopicByName(topicName: string): Promise<any> {

        return dataSource.getRepository(TopicEntity).findOne({
            where: {

                name: topicName
            }
        })

    }
    public static async getAllTopics(): Promise<TopicEntity[]> {

        return dataSource.getRepository(TopicEntity).find()

    }

}