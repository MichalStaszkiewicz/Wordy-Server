import { JwtPayload } from "jsonwebtoken";
import { secretToken } from "../../const/config";
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
import { UserUtils } from "../../logic/user";

const jwt = require("jsonwebtoken");
export async function topicScreenLoadCourses(
  connectedClients: Map<string, string>,
  data: any,
  socket: any,
  io: any
) {
  const headers = socket.handshake.headers;

  let token = headers.authorization;

  const verifiedToken = jwt.verify(token!, secretToken) as JwtPayload;

  const user: UserEntity = await UserService.getUserById(verifiedToken.userId);
  var activeCoursesData: UserCourseEntity[] =
    await UserCourseService.getActiveUserCourses(user);
    

  var activeCourses = await UserUtils.getProgressForVocabulary(activeCoursesData, user);

  var currentUserCourse = user.profile.userCourse;

  var currentCourse;
  activeCourses!.forEach((e) => {
    if (e.activeCourse.userCourse.id == currentUserCourse.id) {
      currentCourse = e;
    }
  });

  io.to(token).emit("loadCourses", { activeCourses, currentCourse });
}
