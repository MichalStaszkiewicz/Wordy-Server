import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { UserEntity } from './user_entity';
import { WordEntity } from './word_entity';
import { UserCourseEntity } from './user_course_entity';
import { VocabularyEntity } from './vocabulary_entity';
@Entity('mode')
export class ModeEntity {
    @PrimaryGeneratedColumn()
    id!: number;



    @ManyToOne(() => VocabularyEntity, vocabulary => vocabulary)

    vocabulary!: VocabularyEntity;
    @OneToMany(() => UserCourseEntity, userCourse => userCourse.mode)
    userCourse!: UserCourseEntity;

}