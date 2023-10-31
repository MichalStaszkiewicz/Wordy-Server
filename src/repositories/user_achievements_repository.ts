import { dataSource } from "..";
import { AchievementEntity } from "../entities/achievement_entity";
import { ProfileEntity } from "../entities/profile_entity";
import { UserAchievementsEntity } from "../entities/user_achievements_entity";
import { UserEntity } from "../entities/user_entity";

export class UserAchievementsRepository {
  public static async getAllUserAchievements(
    profile: ProfileEntity
  ): Promise<UserAchievementsEntity[]> {
    return dataSource.getRepository(UserAchievementsEntity).find({
      where: {
        profile: profile,
      },
      relations: {
        achievement: true,
      },
    });
  }
  public static async save(achievement: UserAchievementsEntity) {
    return dataSource.getRepository(UserAchievementsEntity).save(achievement);
  }
  public static async update(
    profile: ProfileEntity,
    id: number,
    achievement: Partial<UserAchievementsEntity>
  ) {
    return dataSource
      .getRepository(UserAchievementsEntity)
      .update({ profile: profile, id: id }, achievement);
  }
  public static async exists(
    achievement: AchievementEntity,
    profile: ProfileEntity
  ) {
    return dataSource.getRepository(UserAchievementsEntity).findOne({
      where: {
        achievement: achievement,
        profile: profile,
      },
    });
  }
}
