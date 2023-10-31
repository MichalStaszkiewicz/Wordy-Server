import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from './user_entity';
import { CourseEntity } from './course_entity';
import { InterfaceLanguageEntity } from './interface_language';
import { ProfileEntity } from './profile_entity';

import { TopicEntity } from './topic_entity';
import { ModeEntity } from './mode_entity';

@Entity('user_course')
export class UserCourseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => UserEntity, user => user.courses)
    @JoinColumn()
    user!: UserEntity;

    @ManyToOne(() => CourseEntity, course => course.userCourse)
    @JoinColumn()
    course!: CourseEntity;
    @ManyToOne(()=>TopicEntity,topic=>topic.id,)
    lastTopic!:TopicEntity;
    @ManyToOne(() => InterfaceLanguageEntity, interfaceLanguage => interfaceLanguage.userCourses)
    @JoinColumn()
    interfaceLanguage!: InterfaceLanguageEntity;
    @ManyToOne(() => ModeEntity, mode => mode)
    @JoinColumn()
    mode!: ModeEntity;

}