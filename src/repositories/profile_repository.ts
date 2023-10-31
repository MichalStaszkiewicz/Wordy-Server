import { EntityRepository, UpdateResult } from "typeorm";
import { dataSource } from "..";
import { CourseEntity } from "../entities/course_entity";
import { ProfileEntity } from "../entities/profile_entity";
import { UserCourseEntity } from "../entities/user_course_entity";
import { UserEntity } from "../entities/user_entity";


export class ProfileRepository {


    public static async update(user: UserEntity, data: Partial<ProfileEntity>): Promise<UpdateResult> {
        return dataSource.getRepository(ProfileEntity)
            .createQueryBuilder()
            .update(ProfileEntity)
            .set(data)
            .where({ id: user.profile!.id })
            .execute();

    }

    public static async save(profile: ProfileEntity): Promise<any> {
        return dataSource.getRepository(ProfileEntity).save(profile);


    }




}