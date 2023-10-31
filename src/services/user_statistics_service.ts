import { dataSource } from "..";
import { ProfileEntity } from "../entities/profile_entity";
import { UserStatisticsEntity } from "../entities/user_statistics_entity";
import { UserStatisticsRepository } from "../repositories/user_statistics_repository";

export class UserStatisticsService {

    public static async get(profile: ProfileEntity) {

        return UserStatisticsRepository.get(profile)

    }
    public static async save(statistics: UserStatisticsEntity) {

        return UserStatisticsRepository.save(statistics)

    } public static async update(statistics: Partial<UserStatisticsEntity>, profile: ProfileEntity) {

        return UserStatisticsRepository.update(statistics, profile)

    }

}

