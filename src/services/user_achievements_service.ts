import { dataSource } from "..";
import { AchievementEntity } from "../entities/achievement_entity";
import { ProfileEntity } from "../entities/profile_entity";
import { UserAchievementsEntity } from "../entities/user_achievements_entity";
import { UserAchievementsRepository } from "../repositories/user_achievements_repository";

export class UserAchievementService {
  public static async getAll(
    profile: ProfileEntity
  ): Promise<UserAchievementsEntity[]> {
    return UserAchievementsRepository.getAllUserAchievements(profile);
  }
  public static async save(achievement: UserAchievementsEntity) {
    return UserAchievementsRepository.save(achievement);
  }
  public static async exists(
    achievement: AchievementEntity,
    profile: ProfileEntity
  ) {
    return UserAchievementsRepository.exists(achievement, profile);
  }
  public static async update(
    profile: ProfileEntity,
    id: number,
    achievement: Partial<UserAchievementsEntity>
  ) {
    return UserAchievementsRepository.update(profile, id, achievement);
  }
}
