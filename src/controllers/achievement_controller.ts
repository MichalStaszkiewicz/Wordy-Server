import { ResponseToolkit } from "@hapi/hapi";

import { AchievementRepository } from "../repositories/achievement_repository";
import { Request } from "hapi";
import { ICreateAchievement } from "../interfaces/requests/create_achievement";
import { AchievementType } from "../const/enum";
import Boom from "boom";
import { ErrorCodes } from "../const/error_codes";
import { AchievementService } from "../services/achievement_service";
import { AchievementEntity } from "../entities/achievement_entity";
import { Code } from "typeorm";
import { ImageValidator } from "../logic/image";

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
      const payload = request.params;
      let selectedType = "";

      for (const type in AchievementType) {
        if (type.toLowerCase() == payload.type.toLowerCase()) {
          selectedType = payload.type.toLowerCase();
        }
      }
      if (!selectedType) {
        return Boom.badRequest(ErrorCodes.ERROR_INVALID_ACHIEVEMENT_TYPE);
      }
      const imageExist = await ImageValidator.exists(payload.image);
      const allowedExtensions = ImageValidator.validateExtension(payload.image);

      if (!imageExist) {
        return Boom.notFound(ErrorCodes.ERROR_INVALID_IMAGE_PATH);
      }

      if (!allowedExtensions) {
        return Boom.notFound(ErrorCodes.ERROR_INVALID_IMAGE_EXTENSION);
      }
      const achievementExists = await AchievementService.exists(payload.name);
      if (achievementExists) {
        return Boom.badRequest(ErrorCodes.ERROR_ACHIEVEMENT_EXISTS);
      }
      const achievement: AchievementEntity = new AchievementEntity();
      achievement.name = payload.name;
      achievement.description = payload.description;
      achievement.goal = payload.goal;
      achievement.type = payload.type;
      achievement.image = payload.image;

      AchievementService.save(achievement);

      return response
        .response({
          status: 200,
          message: `Successfully created a new achievement named: ${payload.name}`,
        })
        .code(200);
    } catch (error) {
      console.log("Error occured: " + error);
      return Boom.badImplementation();
    }
  }
}
