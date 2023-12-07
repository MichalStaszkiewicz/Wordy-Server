import Joi = require("joi");
import * as Hapi from "@hapi/hapi";
import * as JWT from "jsonwebtoken";

import Boom = require("boom");
import { IValidateToken } from "../../interfaces/validate_token";

import { IRequest } from "../../interfaces/request";
import { ResponseToolkit } from "hapi";
import { JwtPayload } from "../../interfaces/jwt_payload";
import { AchievementEntity } from "../../entities/achievement_entity";
import { UserAchievementsEntity } from "../../entities/user_achievements_entity";
import { UserEntity } from "../../entities/user_entity";
import { UserAchievementService } from "../../services/user_achievements_service";
export function generateToken(payload: any): string {
  //TODO change expiredsIn to 3h
  return JWT.sign(payload,  process.env.SECRET!, { expiresIn: "3h" });
}

export async function checkAndSaveAchievement(
  user: UserEntity,
  achievement: AchievementEntity
) {
  const userAchievementExists = await UserAchievementService.exists(
    achievement,
    user.profile
  );

  if (!userAchievementExists) {
    const userAchievement: UserAchievementsEntity =
      new UserAchievementsEntity();
    userAchievement.achieved = false;
    userAchievement.achievement = achievement;
    userAchievement.profile = user.profile;
    userAchievement.progress = 0;
    
    await UserAchievementService.save(userAchievement);
  }
}

export async function validateToken(
  decoded: JwtPayload,
  request: IRequest,
  response: ResponseToolkit
) {
  const expirationTime = decoded.exp;
  const currentTime = Math.floor(Date.now() / 1000);
  const timeRemaining = expirationTime - currentTime;
  const encodedToken = JWT.sign(decoded,  process.env.SECRET!);
  const verifiedToken = await JWT.verify(encodedToken,  process.env.SECRET!);
  if (verifiedToken) {
    console.log("Token valid");
    console.log("Remaining time: " + timeRemaining);
    return { isValid: true, credentials: { userId: decoded.userId } };
  } else {
    console.log("Token expired");
    return { isValid: false };
  }
}

export const authValidate = Joi.object({
  authorization: Joi.string().required(),
}).options({ allowUnknown: true });
