import { dataSource } from "..";
import { ProfileEntity } from "../entities/profile_entity";
import { UserStatisticsEntity } from "../entities/user_statistics_entity";

export class UserStatisticsRepository {

    public static async get(profile: ProfileEntity) {

        return dataSource.getRepository(UserStatisticsEntity).findOne({
            where: {
                profile: profile

            },
            relations: {
                profile: true,


            }

        })

    }
    public static async save(statistics: UserStatisticsEntity) {

        return dataSource.getRepository(UserStatisticsEntity).save(statistics)

    } public static async update(statistics: Partial<UserStatisticsEntity>, profile: ProfileEntity) {

        return dataSource.getRepository(UserStatisticsEntity)
            .createQueryBuilder()
            .update(UserStatisticsEntity)
            .set(statistics)
            .where({ profile })
            .execute();

    }

}