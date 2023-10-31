import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { AchievementEntity } from './achievement_entity';

import { ProfileEntity } from './profile_entity';
import { UserCourseEntity } from './user_course_entity';
import * as uuid from 'uuid';
import { UserStatisticsEntity } from './user_statistics_entity';
@Entity('user')
export class UserEntity {

  constructor() {

    this.id = uuid.v4();
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;
  @Column({ nullable: false })
  refreshToken!: string;
  @Column({ nullable: true })
  resetPasswordToken!: string;

  @OneToOne(() => ProfileEntity, { nullable: false })
  @JoinColumn()
  profile!: ProfileEntity;


  @OneToMany(() => UserCourseEntity, userCourse => userCourse.course)
  courses!: UserCourseEntity;



}