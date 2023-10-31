import Boom from "boom";
import { ResponseToolkit, Request } from "hapi";
import { UserRepository } from "../repositories/user_repository";
import { ErrorCodes } from "../const/error_codes";
import { ProfileRepository } from "../repositories/profile_repository";
import { Messages } from "../const/messages";
import { UserCourseRepository } from "../repositories/user_course_repository";
import { UserCourseEntity } from "../entities/user_course_entity";
import { InterfaceLanguageEntity } from "../entities/interface_language";
import { UserEntity } from "../entities/user_entity";

import { ProfileService } from "../services/profile_service";
import { IUpdateUserCurrentCourseRequest } from "../interfaces/requests/update_user_current_course_request";
import { CourseService } from "../services/course_service";
import { UserCourseService } from "../services/user_course_service";
import { UserSettingsService } from "../services/user_settings_service";
import { UserService } from "../services/user_service";
import { getProgressForVocabulary } from "../const/common";
import { ProfileEntity } from "../entities/profile_entity";

import { IRequest } from "../interfaces/request";
import { WordService } from "../services/word_service";

import { UserAchievementsEntity } from "../entities/user_achievements_entity";
import { UserAchievementService } from "../services/user_achievements_service";
import { UserStatisticsService } from "../services/user_statistics_service";
import { TopicEntity } from "../entities/topic_entity";
import { TopicService } from "../services/topic_service";
import { VocabularyWordEntity } from "../entities/vocabulary_word_entity";
import { VocabularyEntity } from "../entities/vocabulary_entity";
import { ModeEntity } from "../entities/mode_entity";
import { VocabularyService } from "../services/vocabulary_service";
import { ModeService } from "../services/mode_service";
import { VocabularyWordService } from "../services/vocabulary_word_service";

export class ProfileController {
  public static async getUserProfileData(
    request: IRequest,
    response: ResponseToolkit
  ) {
    const userId: string = request.auth.credentials.userId;

    try {
      if (!userId) {
        return Boom.badRequest(ErrorCodes.ERROR_MISSING_USER_ID);
      }

      const user: UserEntity = await UserService.getUserById(userId);
      if (!user) {
        return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);
      }
      const userCourses: UserCourseEntity[] =
        await UserCourseService.getActiveUserCourses(user);
      const vocabularyProgress = await getProgressForVocabulary(
        userCourses,
        user
      );
      const knownWords: VocabularyWordEntity[] = [];
      const vocabularyList = [];
      for await (const userCourse of userCourses) {
        vocabularyList.push(userCourse.mode.vocabulary);
      }
      for await (const vocabulary of vocabularyList) {
        knownWords.push(
          ...(await VocabularyWordService.getKnownWords(vocabulary))
        );
      }

      let finishedCourses = 0;
      vocabularyProgress!.forEach((element) => {
        if (element.activeCourse.totalProgress == 100) {
          finishedCourses++;
        }
      });

      let achievements: UserAchievementsEntity[] =
        await UserAchievementService.getAll(user.profile);
      var userStats = await UserStatisticsService.get(user.profile);

      return response.response({
        finishedCourses: finishedCourses,
        knownWords: knownWords.length,
        vocabularyProgress,
        achievements,
        hotStreak: userStats?.hotStreak,
        fullName: user.profile.fullName,
      });
    } catch (error) {
      console.log(error);
      return Boom.badImplementation();
    }
  }
  public static async getUserCurrentCourse(
    request: IRequest,
    response: ResponseToolkit
  ) {
    const userId: string = request.auth.credentials.userId;
    try {
      if (!userId) {
        return Boom.badRequest(ErrorCodes.ERROR_MISSING_USER_ID);
      }

      const user: UserEntity = await UserService.getUserById(userId);
      if (!user) {
        return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);
      }

      const userCourse: UserCourseEntity = user.profile.userCourse;
      return response.response({
        message: Messages.MESSAGE_SUCCESS,
        userCourse,
      });
    } catch (error) {
      console.log(error);
      return Boom.badImplementation();
    }
  }
  public static async updateUserCurrentCourse(
    request: IUpdateUserCurrentCourseRequest,
    response: ResponseToolkit
  ) {
    try {
      const userId = request.auth.credentials.userId;

      if (!userId) {
        return Boom.badRequest(ErrorCodes.ERROR_MISSING_USER_ID);
      }

      const user: UserEntity = await UserService.getUserById(userId);
      if (!user) {
        return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);
      }
      const course = await CourseService.getCourseByName(
        request.payload.courseName
      );
      if (!course) {
        return Boom.badRequest(ErrorCodes.ERROR_INVALID_COURSE);
      }

      const userCourse: UserCourseEntity =
        await UserCourseService.checkUserCourseExistence(course, user);

      if (!userCourse || userCourse == undefined) {
        const tempUserCourse: UserCourseEntity = new UserCourseEntity();
        const vocabualry: VocabularyEntity = new VocabularyEntity();
        const mode: ModeEntity = new ModeEntity();
        mode.vocabulary = await VocabularyService.save(vocabualry);
        let lastTopic: TopicEntity = await TopicService.getTopicById(1);
        tempUserCourse.user = user;
        tempUserCourse.interfaceLanguage =
          user.profile.settings.interfaceLanguage;
        tempUserCourse.course = course;
        tempUserCourse.lastTopic = lastTopic;
        tempUserCourse.mode = await ModeService.save(mode);
        if (
          tempUserCourse.course.name == tempUserCourse.interfaceLanguage.name
        ) {
          return Boom.badRequest(
            ErrorCodes.ERROR_COURSE_AND_INTERFACE_LANGUAGE_CANNOT_BE_THE_SAME
          );
        }
        const tempCourse: UserCourseEntity = await UserCourseService.save(
          tempUserCourse
        );
        const partial: Partial<ProfileEntity> = {
          userCourse: tempCourse,
        };
        await ProfileService.updateCurrentCourse(user, partial);

        return response
          .response({
            message: Messages.MESSAGE_SUCCESS,
            updatedCourse: tempCourse,
          })
          .code(200);
      }
      const partial: Partial<ProfileEntity> = {
        userCourse: userCourse,
      };
      await ProfileService.updateCurrentCourse(user, partial);

      return response
        .response({
          message: Messages.MESSAGE_SUCCESS,
          updatedCourse: userCourse,
        })
        .code(200);
    } catch (error) {
      console.log(error);
      return Boom.badImplementation();
    }
  }
}
