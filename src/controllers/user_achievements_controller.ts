import Boom from 'boom';
import { Request, ResponseToolkit } from 'hapi';
import { ErrorCodes } from '../const/error_codes';
import { UserAchievementsRepository } from '../repositories/user_achievements_repository';
import { UserAchievementsEntity } from '../entities/user_achievements_entity';
import { AchievementEntity } from '../entities/achievement_entity';
import { AchievementController } from './achievement_controller';
import { AchievementRepository } from '../repositories/achievement_repository';
import { Messages } from '../const/messages';
import { IRequest } from '../interfaces/request';
import { UserEntity } from '../entities/user_entity';
import { UserService } from '../services/user_service';
import { UserCourseController } from './user_course_controller';
import { AchievementService } from '../services/achievement_service';
import { IAddUserAchievementRequest } from '../interfaces/requests/add_user_achievement_request';
import { UserAchievementService } from '../services/user_achievements_service';
import { ProfileService } from '../services/profile_service';




export class UserAchievementsController {
    public static async getAllUserAchievements(request: IRequest, response: ResponseToolkit) {
        const userId: string = request.auth.credentials.userId;

        try {

            if (!userId) {
                return Boom.badRequest(ErrorCodes.ERROR_MISSING_USER_ID);
            }
            const user: UserEntity = await UserService.getUserById(userId);
            const userAchievements: UserAchievementsEntity[] = await UserAchievementService.getAll(user.profile);


            return { "achievements": userAchievements };

        } catch (error) {
            console.log(error);
            return Boom.badImplementation();
        }


    }
    public static async hasUserAchieved(request: IRequest, response: ResponseToolkit) {

        const userId: string = request.auth.credentials.userId;

        try {
            if (!userId) {

                return Boom.badRequest(ErrorCodes.ERROR_MISSING_USER_ID);
            }
            var user: UserEntity = await UserService.getUserById(userId);
            if (!user) {
                return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);
            }
            var totalWords = await UserCourseController.getTotalKnownWords(request, response);

            var userAchievements: UserAchievementsEntity[] = await UserAchievementService.getAll(user.profile);
            var achievements: AchievementEntity[] = await AchievementService.getAll();
            var validUserAchievements: AchievementEntity[];
            userAchievements.forEach(userAchievement => {
                validUserAchievements.push(userAchievement.achievement);
            });
            if (userAchievements.length != achievements.length) {

                return Boom.badImplementation();
            }
            var newUserAchievements: AchievementEntity[] = [];
            userAchievements.forEach(achievement => {
                if (achievement.achievement.type == 'word') {

                    if (totalWords >= achievement.achievement.goal) {
                        const partial: Partial<UserAchievementsEntity> = ({
                            progress: achievement.achievement.goal,
                            achieved: true,

                        });
                        UserAchievementService.update(user.profile,achievement.id, partial);

                    } else {

                        const partial: Partial<UserAchievementsEntity> = ({
                            progress: totalWords


                        });
                        UserAchievementService.update(user.profile,achievement.id,partial);
                    }
                }
            });


            return { achieved: newUserAchievements, }




        } catch (error) {
            console.log(error)
            return Boom.badImplementation();

        }

    }




}