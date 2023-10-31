
import { CourseEntity } from "../entities/course_entity";
import { InterfaceLanguageEntity } from "../entities/interface_language";
import { TopicEntity } from "../entities/topic_entity";
import { UserEntity } from "../entities/user_entity";
import { VocabularyEntity } from "../entities/vocabulary_entity";
import { VocabularyWordEntity } from "../entities/vocabulary_word_entity";
import { VocabularyWordRepository } from "../repositories/vocabulary_word_repository";


export class VocabularyWordService {

    public static async save(vocabularyWord: VocabularyWordEntity): Promise<any> {
        return VocabularyWordRepository.save(vocabularyWord);
    }
 
    public static async getKnownWordsByTopic(vocabularyId: number, interfaceLanguage: InterfaceLanguageEntity, course: CourseEntity, topic: TopicEntity): Promise<any> {

        return VocabularyWordRepository.getKnownWordsByTopic(vocabularyId, interfaceLanguage, course, topic,)

    }
    public static async getKnownWords(vocabulary: VocabularyEntity,): Promise<VocabularyWordEntity[]> {
        return VocabularyWordRepository.getKnownWords(vocabulary);


    } public static async getKnownWordsForQuiz(vocabulary: number,user:UserEntity): Promise<VocabularyWordEntity[]> {
        return VocabularyWordRepository.getKnownWordsForQuiz(vocabulary,user);


    }
    public static async getVocabularyWordsByIdAndTopic(vocabualry: VocabularyEntity, topic: TopicEntity): Promise<VocabularyWordEntity[]> {
        return VocabularyWordRepository.getVocabularyWordsByIdAndTopic(vocabualry, topic);


    }
   
    public static async existingVocabularyWord(vocabularyWord: VocabularyWordEntity): Promise<any> {

        return VocabularyWordRepository.existingVocabularyWord(vocabularyWord);

    }

}