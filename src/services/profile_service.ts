import { EntityRepository } from "typeorm";
import { dataSource } from "..";
import { CourseEntity } from "../entities/course_entity";
import { ProfileEntity } from "../entities/profile_entity";
import { UserCourseEntity } from "../entities/user_course_entity";
import { UserEntity } from "../entities/user_entity";
import { ProfileRepository } from "../repositories/profile_repository";


export class ProfileService {


    public static async updateCurrentCourse(user: UserEntity, course: Partial<ProfileEntity>): Promise<any> {
        return ProfileRepository.update(user, course);

    }
 
    public static async createProfile(profile: ProfileEntity): Promise<any> {
        return ProfileRepository.save(profile);


    }
    public static async update(user: UserEntity, data: Partial<ProfileEntity>): Promise<any> {

        return ProfileRepository.update(user, data);

    }



}