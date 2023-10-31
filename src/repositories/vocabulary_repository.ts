import { dataSource } from "..";

import { UserCourseEntity } from "../entities/user_course_entity";
import { VocabularyEntity } from "../entities/vocabulary_entity";

export class VocabularyRepository {


    public static async getVocabularyCourseById(id: number): Promise<VocabularyEntity | null> {

        return dataSource.getRepository(VocabularyEntity).findOne({
            where: {
                id: id

            }, relations: {
                vocabularyWord: {
                    vocabulary: true,
                }
            }
        })

    }

    public static async save(vocabulary: VocabularyEntity) {
        return dataSource.getRepository(VocabularyEntity).save(vocabulary);

    }

}