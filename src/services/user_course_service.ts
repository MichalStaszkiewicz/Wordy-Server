import { dataSource } from "..";
import { CourseEntity } from "../entities/course_entity";
import { InterfaceLanguageEntity } from "../entities/interface_language";
import { UserCourseEntity } from "../entities/user_course_entity";
import { UserEntity } from "../entities/user_entity";
import { UserCourseRepository } from "../repositories/user_course_repository";

export class UserCourseService {

    public static async save(userCourse: UserCourseEntity): Promise<any> {

        return UserCourseRepository.save(userCourse);

    }

    public static async update(userCourse: Partial<UserCourseEntity>, id: number): Promise<any> {

        return UserCourseRepository.update(userCourse, id);

    }
    public static async getUserCourseById(id: number): Promise<any> {
        return UserCourseRepository.getUserCourseById(id);

    }
    public static async getUserCourse(user: UserEntity, course: CourseEntity): Promise<any> {
        return UserCourseRepository.getUserCourse(user, course);
    }
 
    public static async checkUserCourseExistence(course: CourseEntity, user: UserEntity): Promise<any> {
        return UserCourseRepository.checkUserCourseExistence(course, user);

    }
    public static async getActiveUserCourses(user: UserEntity): Promise<UserCourseEntity[]> {

        return UserCourseRepository.getActiveUserCourses(user);


    } 


}