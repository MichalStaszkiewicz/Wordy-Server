import { dataSource } from "..";
import { TopicEntity } from "../entities/topic_entity";
import { TopicRepository } from "../repositories/topic_repository";

export class TopicService {

    public static async getTopicById(id: number): Promise<any> {

        return TopicRepository.getTopicById(id);

    }
    public static async getTopicByName(topicName: string): Promise<any> {

        return TopicRepository.getTopicByName(topicName);

    }
    public static async getAllTopics(): Promise<TopicEntity[]> {

        return TopicRepository.getAllTopics();

    }
}