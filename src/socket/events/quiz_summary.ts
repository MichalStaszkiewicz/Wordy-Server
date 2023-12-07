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
import { TQuizSummary } from "../../const/types/quiz_summary";
import { UserUtils } from "../../logic/user";

const jwt = require("jsonwebtoken");
export async function quizSummary(
  connectedClients: Map<string, string>,
  data: any,
  socket: any,
  io: any
) {
  const headers = socket.handshake.headers;
  const requestData = data as TQuizSummary;
  const verifiedToken = jwt.verify(
    headers.authorization!,
    process.env.SECRET
  ) as JwtPayload;
  const user: UserEntity = await UserService.getUserById(verifiedToken.userId);
  if (!user) {
    return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);
  }

  var achievementsData = (await UserUtils.syncAchievements(
    verifiedToken.userId
  )) as INewUserAchievementResponse;
  var achievements = achievementsData.achieved;

  var hotStreak = 0;
  if (
    (await UserUtils.completedDaily(user)) == false &&
    user.profile.statistics.dailyLesson == false
  ) {
    var hasUserCompletedYesterDayLesson = await UserUtils.completedYesterday(
      user
    );
    if (hasUserCompletedYesterDayLesson) {
      var currentHotStreak = user.profile.statistics.hotStreak;
      currentHotStreak++;
      let todayDate = new Date();
      const partial: Partial<UserStatisticsEntity> = {
        hotStreak: currentHotStreak,
        dailyLesson: true,
        lastLessonDate: todayDate,
      };
      hotStreak = currentHotStreak;
      await UserStatisticsService.update(partial, user.profile);
    } else {
      let todayDate = new Date();
      const partial: Partial<UserStatisticsEntity> = {
        hotStreak: 1,
        dailyLesson: true,
        lastLessonDate: todayDate,
      };

      await UserStatisticsService.update(partial, user.profile);
    }
  }
  const currentUserCourse = user.profile.userCourse;
  const topicEntity = await TopicService.getTopicByName(requestData.topic);

  const currentCoursePartial: Partial<UserCourseEntity> = {
    lastTopic: topicEntity,
  };

  await UserCourseService.update(currentCoursePartial, currentUserCourse.id!);
  io.to(headers.authorization).emit("got_new_achievement", {
    achievements,
    hotStreak: hotStreak,
  });
}
