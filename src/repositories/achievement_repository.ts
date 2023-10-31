import { dataSource } from "..";
import { AchievementEntity } from "../entities/achievement_entity";

export class AchievementRepository {

   public static async getAllAchievements(): Promise<AchievementEntity[]> {

      return dataSource.getRepository(AchievementEntity).find();
   }
   public static async getAchievementById(id: number): Promise<any> {

      return dataSource.getRepository(AchievementEntity).findOneBy({ id: id })
   }
   public static async save(achievement: AchievementEntity) {

      return dataSource.getRepository(AchievementEntity).save(achievement);

   }

}