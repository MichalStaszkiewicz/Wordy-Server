import { ResponseToolkit } from "@hapi/hapi";

import { AchievementRepository } from "../repositories/achievement_repository";
import { Request } from "hapi";

export class AchievementController {
  public static async getAllAchievements(
    request: Request,
    response: ResponseToolkit
  ) {
    try {
      const achievements = AchievementRepository.getAllAchievements();
      return achievements;
    } catch (error) {
      console.log("Error occured: " + error);
    }
  }
  public static async getAchievementById(
    request: Request,
    response: ResponseToolkit
  ) {
    try {
      return AchievementRepository.getAchievementById(
        parseInt(request.params.id)
      );
    } catch (error) {
      console.log("Error occured: " + error);
    }
  }
  public static async save(
    request: ICreateAchievement,
    response: ResponseToolkit
  ) {
    try {
        
    } catch (error) {
      console.log("Error occured: " + error);
    }
  }
}
