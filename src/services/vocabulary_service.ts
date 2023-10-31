
import { UserCourseEntity } from "../entities/user_course_entity";
import { VocabularyEntity } from "../entities/vocabulary_entity";
import { VocabularyRepository } from "../repositories/vocabulary_repository";


export class VocabularyService {


    public static async getVocabularyCourse(id: number): Promise<VocabularyEntity | null> {

        return VocabularyRepository.getVocabularyCourseById(id)

    }

    public static async save(vocabulary: VocabularyEntity) {
        return VocabularyRepository.save(vocabulary);

    }

}