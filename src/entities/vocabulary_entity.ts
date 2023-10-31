import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user_entity';
import { WordEntity } from './word_entity';
import { UserCourseEntity } from './user_course_entity';
import { VocabularyWordEntity } from './vocabulary_word_entity';


@Entity('vocabulary')
export class VocabularyEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => VocabularyWordEntity, vocabularyWord => vocabularyWord.vocabulary)

    vocabularyWord!: VocabularyWordEntity;

}
