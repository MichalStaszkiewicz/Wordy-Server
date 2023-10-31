import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user_entity';
import { WordEntity } from './word_entity';
import { UserCourseEntity } from './user_course_entity';
@Entity('course')
export class CourseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  image!: string;
  @Column()
  circularImage!: string;

  @OneToMany(() => UserCourseEntity, userCourse => userCourse.course)
  userCourse!: UserCourseEntity;


}