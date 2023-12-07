import { JwtPayload } from "jsonwebtoken";

import Boom from "boom";
import { io } from "socket.io-client";

import { ErrorCodes } from "../../const/error_codes";
import { UserCourseEntity } from "../../entities/user_course_entity";
import { UserEntity } from "../../entities/user_entity";
import { UserStatisticsEntity } from "../../entities/user_statistics_entity";
import { INewUserAchievementResponse } from "../../interfaces/responses/new_user_achievement_response";
import { TopicService } from "../../services/topic_service";
import { UserCourseService } from "../../services/user_course_service";
import { UserService } from "../../services/user_service";
import { UserStatisticsService } from "../../services/user_statistics_service";
const jwt = require("jsonwebtoken");
export async function addCourse(
  connectedClients: Map<string, string>,
  token: any,
  socket: any,
  io: any
) {
  try {
    const verifiedToken = jwt.verify(token,  process.env.SECRET) as JwtPayload;

    const user: UserEntity = await UserService.getUserById(
      verifiedToken.userId
    );
    const courses = await UserCourseService.getActiveUserCourses(user);

    io.to(token).emit("updated_course_list", courses);
  } catch (error) {
    console.error("Error adding course:", error);
  }
}
