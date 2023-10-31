import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user_entity";
import { UserSettingsEntity } from "./user_settings";
import { UserCourseEntity } from "./user_course_entity";

@Entity('interface_language')
export class InterfaceLanguageEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  image!: string;
  @Column()
  circularImage!: string;
  @OneToMany(() => UserSettingsEntity, settings => settings.interfaceLanguage)
  settings!: UserSettingsEntity[];
  @OneToMany(() => UserCourseEntity, userCourse => userCourse.course)
  userCourses!: UserCourseEntity[];

}