import { UUID } from "typeorm/driver/mongodb/bson.typings";

import { TopicEntity } from "../entities/topic_entity";
import { ActiveCourseProgress } from "../interfaces/model/active_course_progress";

import { TopicService } from "../services/topic_service";
import { WordService } from "../services/word_service";
import { UserCourseEntity } from "../entities/user_course_entity";
import { TopicProgress } from "../interfaces/model/topic_progress";
import { UserCourseService } from "../services/user_course_service";
import Boom from "boom";

import { UserService } from "../services/user_service";
import { ErrorCodes } from "./error_codes";

import { UserCourseController } from "../controllers/user_course_controller";
import { AchievementEntity } from "../entities/achievement_entity";
import { UserAchievementsEntity } from "../entities/user_achievements_entity";
import { UserEntity } from "../entities/user_entity";
import { AchievementService } from "../services/achievement_service";
import { UserAchievementService } from "../services/user_achievements_service";
import { UserStatisticsService } from "../services/user_statistics_service";
import { VocabularyWordEntity } from "../entities/vocabulary_word_entity";
import { VocabularyWordService } from "../services/vocabulary_word_service";
import { VocabularyService } from "../services/vocabulary_service";

export async function hasUserAchievedWithoutRequest(userId: string) {
  try {
    if (!userId) {
      return Boom.badRequest(ErrorCodes.ERROR_MISSING_USER_ID);
    }
    var user: UserEntity = await UserService.getUserById(userId);
    if (!user) {
      return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);
    }
    var totalWords = await getTotalKnownWords(userId);

    var userAchievements: UserAchievementsEntity[] =
      await UserAchievementService.getAll(user.profile);
    var userAchievementsAfterUpdate: UserAchievementsEntity[] = [];
    var validUserAchievements: AchievementEntity[] = [];
    var newestUserAchievements: UserAchievementsEntity[] = [];
    userAchievements.forEach((userAchievement) => {
      validUserAchievements.push(userAchievement.achievement);
      if (userAchievement.achievement.type == "word") {
        if (
          totalWords.totalWords >= userAchievement.achievement.goal &&
          userAchievement.achieved == false
        ) {
          userAchievement.achieved = true;
          userAchievement.progress = userAchievement.achievement.goal;
          userAchievementsAfterUpdate.push(userAchievement);
          newestUserAchievements.push(userAchievement);
        } else {
          userAchievement.progress = totalWords.totalWords;
          userAchievementsAfterUpdate.push(userAchievement);
        }
      }
    });

    for await (const achievement of userAchievementsAfterUpdate) {
      const partial: Partial<UserAchievementsEntity> = {
        achieved: achievement.achieved,
        progress: achievement.progress,
      };
      await UserAchievementService.update(
        user.profile,
        achievement.id,
        partial
      );
    }

    var achievements: UserAchievementsEntity[] = [];
    for (const achievement of newestUserAchievements) {
      if (achievement.achieved) {
        achievements.push(achievement);
      }
    }

    return { achieved: achievements };
  } catch (error) {
    console.log(error);
    return Boom.badImplementation();
  }
}
export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
export async function getTotalKnownWords(userId: string): Promise<any> {
  try {
    var user = await UserService.getUserById(userId);
    if (!user) {
      return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);
    }
    var userCourses = await UserCourseService.getActiveUserCourses(user);
    if (!userCourses) {
      return Boom.badImplementation();
    }
    let vocabualaryProgress: ActiveCourseProgress[] =
      (await getProgressForVocabulary(
        userCourses,
        user
      )) as ActiveCourseProgress[];

    var totalWords = 0;
    vocabualaryProgress.forEach((element) => {
      totalWords += element.activeCourse.knownWords;
    });

    return { totalWords: totalWords };
  } catch (error) {
    console.log(error);
    return Boom.badImplementation();
  }
}
export async function getProgressForVocabulary(
  activeCoursesData: UserCourseEntity[],
  user: UserEntity
) {
  try {
    let totalWordsCount: number = (await WordService.getAllWords()).length;

    let topics: TopicEntity[] = await TopicService.getAllTopics();
    let topicWordCountMap: Map<String, number> = new Map();
    let topicWordKnownCountMap: Map<String, number> = new Map();

    for await (const topic of topics) {
      let wordCount: number = (await WordService.getWordsWithTopic(topic))
        .length;

      topicWordCountMap.set(topic.name, wordCount);
    }
    let activeCourses: ActiveCourseProgress[] = [];

    let knownWords: VocabularyWordEntity[] = [];
    let topicProgress: TopicProgress[] = [];
    for await (const activeCourse of activeCoursesData) {
      let finishedTopics = 0;

      knownWords = await VocabularyWordService.getKnownWords(
        activeCourse.mode.vocabulary
      );
      for (const topic of topics) {
        var knownWordsInGivenTopic = (
          await VocabularyWordService.getVocabularyWordsByIdAndTopic(
            activeCourse.mode.vocabulary,
            topic
          )
        ).length;
        topicWordKnownCountMap.set(topic.name, knownWordsInGivenTopic);
        if (topicWordCountMap.get(topic.name) == knownWordsInGivenTopic) {
          finishedTopics++;
        }
        topicProgress.push({
          name: topic.name,
          knownWords: topicWordKnownCountMap.get(topic.name)!,
          wordsCount: topicWordCountMap.get(topic.name)!,
          topic: topic,
        });
      }

      for (const word of knownWords) {
        if (topicWordKnownCountMap.has(word.word.topic.name)) {
          let words = topicWordKnownCountMap.get(word.word.topic.name);
          topicWordKnownCountMap.set(word.word.topic.name, words! + 1);
        } else {
          topicWordKnownCountMap.set(word.word.topic.name, 1);
        }
      }

      const newCourseProgress: ActiveCourseProgress = {
        activeCourse: {
          topicProgress: topicProgress,
          userCourse: activeCourse,
          finishedTopics: finishedTopics,
          knownWords: knownWords.length,
          totalProgress: Number(
            ((knownWords.length / totalWordsCount) * 100).toPrecision(2)
          ),
          topicsCount: topics.length,
          totalWordsCount: totalWordsCount,
        },
      };

      activeCourses.push(newCourseProgress);
      topicWordKnownCountMap.clear();
      topicProgress = [];
      finishedTopics = 0;
    }
    return activeCourses;
  } catch (error) {
    console.log(error);
  }
}

export async function hasUserCompletedLessonToday(user: UserEntity) {
  try {
    const userStatistics = await UserStatisticsService.get(user.profile);
    if (!userStatistics) {
      return Boom.badRequest(ErrorCodes.ERROR_USER_HAS_NO_STATISTICS);
    }
    if (userStatistics.lastLessonDate == null) {
      return false;
    }

    const lastLessonDate = userStatistics.lastLessonDate;
    const today = new Date();
    const isLessonCompletedToday = isSameDay(lastLessonDate, today);

    return isLessonCompletedToday;
  } catch (error) {
    console.log(error);
    return Boom.badImplementation();
  }
}
export async function hasUserCompletedLessonYesterday(user: UserEntity) {
  try {
    const userStatistics = await UserStatisticsService.get(user.profile);
    if (!userStatistics) {
      return Boom.badRequest(ErrorCodes.ERROR_USER_HAS_NO_STATISTICS);
    }
    const lastLessonDate = userStatistics.lastLessonDate;
    if (lastLessonDate == null) {
      return false;
    }

    const yesterday = getYesterday();
    if (yesterday == null || lastLessonDate == null) {
      return false;
    }
    const isLessonCompletedYesterday = isSameDay(lastLessonDate, yesterday);

    return isLessonCompletedYesterday;
  } catch (error) {
    console.log(error);
    return Boom.badImplementation();
  }
}
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
export function getYesterday(): Date {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday;
}
