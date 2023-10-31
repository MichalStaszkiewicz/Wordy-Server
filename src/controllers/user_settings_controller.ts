import Boom from "boom";
import { ResponseToolkit, Request } from "hapi";
import { ErrorCodes } from "../const/error_codes";
import { UserRepository } from "../repositories/user_repository";
import { UserSettingsEntity } from "../entities/user_settings";
import { UserSettingsRepository } from "../repositories/user_settings_repository";
import { Messages } from "../const/messages";
import { UserEntity } from "../entities/user_entity";
import { IUpdateUserInterfaceLanguageRequest } from "../interfaces/requests/update_user_ui_language_request";
import { InterfaceLanguageRepository } from "../repositories/interface_language_repository";
import { UserSettingsService } from "../services/user_settings_service";
import { UserService } from "../services/user_service";
import { InterfaceLanguageService } from "../services/interface_language_service";
import { IRequest } from "../interfaces/request";
import { UserCourseService } from "../services/user_course_service";
import { UserCourseEntity } from "../entities/user_course_entity";
import { InterfaceLanguageEntity } from "../entities/interface_language";
import { ModeEntity } from "../entities/mode_entity";
import { VocabularyEntity } from "../entities/vocabulary_entity";
import { VocabularyService } from "../services/vocabulary_service";
import { ProfileEntity } from "../entities/profile_entity";
import { getProgressForVocabulary } from "../const/common";
import { ActiveCourseProgress } from "../interfaces/model/active_course_progress";
import { ProfileService } from "../services/profile_service";


export class UserSettingsController {

    public static async getUserSettings(request: IRequest, response: ResponseToolkit) {
        const userId: string = request.auth.credentials.userId;

        try {


            if (!userId) {
                return Boom.badRequest(ErrorCodes.ERROR_MISSING_USER_ID);
            }
      
            const user = await UserService.getUserById(userId);
            if (!user) {
                return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);
            }

            const userSettings: UserSettingsEntity = await UserSettingsService.getUserSettings(user);

            if (!userSettings) {

                return Boom.badRequest(ErrorCodes.ERROR_USER_SETTINGS_NOT_FOUND);
            }

            return response.response({ userSettings }).code(200);

        } catch (error) {
            console.log(error);
            return Boom.badImplementation();
        }

    }

    public static async updateUserInterfaceLanguage(request: IUpdateUserInterfaceLanguageRequest, response: ResponseToolkit) {
        const payload = request.payload;
        try {
            const userId: string = request.auth.credentials.userId;
            const userLanguage = payload.languageName;

            if (!userId) {
                return Boom.badRequest(ErrorCodes.ERROR_MISSING_USER_ID);
            }

            const user: UserEntity = await UserService.getUserById(userId);
            if (!user) {

                return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);

            }
      
            if (!userLanguage) {
                return Boom.badRequest(ErrorCodes.ERROR_INVALID_LANGUAGE);
            }

            const language: InterfaceLanguageEntity = await InterfaceLanguageService.getLanguageByName(userLanguage);
            if (!language) {
                return Boom.badRequest(ErrorCodes.ERROR_INVALID_LANGUAGE);
            } const userSettingsPartial: Partial<UserSettingsEntity> = ({

                interfaceLanguage: language,

            });




      
            await UserSettingsService.updateInterfaceLanguage(user, userSettingsPartial);
            const userAfterlanguageUpdate: UserEntity = await UserService.getUserById(userId);
            const userCourses = await UserCourseService.getActiveUserCourses(userAfterlanguageUpdate);
            if (userCourses.length > 0) {
                const progresses: ActiveCourseProgress[] | undefined = await getProgressForVocabulary(userCourses, userAfterlanguageUpdate);
                if (progresses == null) {
                    return Boom.badImplementation();
                }
                progresses as ActiveCourseProgress[];
                let highestTotalProgress = 0.0;
                let currentUserCourse: UserCourseEntity = new UserCourseEntity;
                for (const progress of progresses) {
                    if (progress.activeCourse.totalProgress >= highestTotalProgress) {
                 
                        currentUserCourse = progress.activeCourse.userCourse;
                    }

                }
                const profilePartial: Partial<ProfileEntity> = ({

                    userCourse: currentUserCourse,

                })

                await ProfileService.update(userAfterlanguageUpdate, profilePartial);
                return response.response({ message: Messages.MESSAGE_SUCCESS, updatedLanguageName: request.payload.languageName, userCoursesInThisLanguage: userCourses.length }).code(200)
            } 

            

            return response.response({ message: Messages.MESSAGE_SUCCESS, updatedLanguageName: request.payload.languageName, userCoursesInThisLanguage: userCourses.length }).code(200)

        } catch (error) {
            console.log(error);
            return Boom.badImplementation();

        }


    }

}