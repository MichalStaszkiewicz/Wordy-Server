import { dataSource } from "..";
import { CourseEntity } from "../entities/course_entity";
import { InterfaceLanguageEntity } from "../entities/interface_language";
import { UserCourseEntity } from "../entities/user_course_entity";
import { UserEntity } from "../entities/user_entity";

export class UserCourseRepository {
  public static async save(userCourse: UserCourseEntity): Promise<any> {
    return dataSource.getRepository(UserCourseEntity).save(userCourse);
  }
  public static async update(
    userCourse: Partial<UserCourseEntity>,
    id: number
  ): Promise<any> {
    return dataSource
      .getRepository(UserCourseEntity)
      .update({ id: id }, userCourse);
  }
  public static async getUserCourse(
    user: UserEntity,
    course: CourseEntity
  ): Promise<any> {
    return dataSource.getRepository(UserCourseEntity).findOne({
      where: {
        user: user,
        interfaceLanguage: user.profile.settings.interfaceLanguage,
        course: course,
      },
      relations: {
        course: true,
        interfaceLanguage: true,
        lastTopic: true,
        mode: {
          vocabulary: true,
        },
      },
    });
  }

  public static async checkUserCourseExistence(
    course: CourseEntity,
    user: UserEntity
  ): Promise<any> {
    return dataSource.getRepository(UserCourseEntity).findOne({
      where: {
        lastTopic: true,
        interfaceLanguage: user.profile.settings.interfaceLanguage,
        course: course,
        user: user,
      },
      relations: {
        course: true,
        interfaceLanguage: true,
        mode: {
          vocabulary: {
            vocabularyWord: true,
          },
        },
        lastTopic: true,
      },
    });
  }
  public static async getUserCourseById(id: number): Promise<any> {
    return dataSource.getRepository(UserCourseEntity).findOne({
      where: {
        id: id,
      },
      relations: {
        interfaceLanguage: true,
        course: true,
        lastTopic: true,
        mode: {
          vocabulary: true,
        },
      },
    });
  }

  public static async getActiveUserCourses(
    user: UserEntity
  ): Promise<UserCourseEntity[]> {
    return dataSource.getRepository(UserCourseEntity).find({
      where: {
        user: user,
        interfaceLanguage: user.profile.settings.interfaceLanguage,
      },
      relations: {
        course: true,

        interfaceLanguage: true,
        lastTopic: true,
        mode: {
          vocabulary: true,
        },
      },
    });
  }
}
