import { TopicEntity } from "../../entities/topic_entity"

export interface TopicProgress {
  
        name: string,
        knownWords: number,
        wordsCount: number,
        topic:TopicEntity
    

}