import { AchievementEntity } from "../entities/achievement_entity";
import { UserCourseEntity } from "../entities/user_course_entity";
import { AchievementRepository } from "../repositories/achievement_repository";

export class AchievementService {
  public static async getAll(): Promise<AchievementEntity[]> {
    return AchievementRepository.getAllAchievements();
  }
  public static async getById(id: number): Promise<AchievementEntity> {
    return AchievementRepository.getAchievementById(id);
  }
  public static async exists(name: string): Promise<AchievementEntity> {
    return AchievementRepository.exists(name);
  }

  public static async save(
    achievement: AchievementEntity
  ): Promise<AchievementEntity> {
    return AchievementRepository.save(achievement);
  }
}
