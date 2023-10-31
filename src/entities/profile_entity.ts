import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { UserEntity } from './user_entity';
import { WordEntity } from './word_entity';
import { UserCourseEntity } from './user_course_entity';
import * as uuid from 'uuid';
import { UserSettingsEntity } from './user_settings';
import { UserAchievementsEntity } from './user_achievements_entity';
import { UserStatisticsEntity } from './user_statistics_entity';
@Entity('profile')
export class ProfileEntity {
    constructor() {

        this.id = uuid.v4();
    }

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    fullName!: string;


    @OneToOne(() => UserCourseEntity,)
    @JoinColumn()
    userCourse!: UserCourseEntity;
    @OneToOne(() => UserStatisticsEntity, userStats => userStats.id)
    @JoinColumn()
    statistics!: UserStatisticsEntity;
    @OneToOne(() => UserSettingsEntity, settings => settings.id)
    @JoinColumn()
    settings!: UserSettingsEntity;


}