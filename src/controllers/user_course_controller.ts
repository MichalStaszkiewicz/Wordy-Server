import { ResponseToolkit, Request } from "hapi";
import { IInsertUserCourse } from "../interfaces/requests/insert_user_course_request";
import Boom from "boom";
import { CourseRepository } from "../repositories/course_repository";
import { InterfaceLanguageEntity } from "../entities/interface_language";
import { InterfaceLanguageRepository } from "../repositories/interface_language_repository";
import { UserRepository } from "../repositories/user_repository";
import { UserCourseEntity } from "../entities/user_course_entity";
import { ErrorCodes } from "../const/error_codes";
import { UserCourseRepository } from "../repositories/user_course_repository";
import { ProfileRepository } from "../repositories/profile_repository";
import { ProfileEntity } from "../entities/profile_entity";

import { CourseService } from "../services/course_service";
import { InterfaceLanguageService } from "../services/interface_language_service";
import { UserService } from "../services/user_service";
import { UserCourseService } from "../services/user_course_service";

import { Messages } from "../const/messages";

import { UserEntity } from "../entities/user_entity";
import { TopicEntity } from "../entities/topic_entity";
import { TopicService } from "../services/topic_service";
import { WordService } from "../services/word_service";
import { ActiveCourseProgress } from "../interfaces/model/active_course_progress";
import { ProfileService } from "../services/profile_service";


import { TopicProgress } from "../interfaces/model/topic_progress";
import { CourseEntity } from "../entities/course_entity";

import { UserController } from "./user_controller";

import { getProgressForVocabulary } from "../const/common";
import { IRequest } from "../interfaces/request";
import { ICourseProgressResponse } from "../interfaces/responses/course_progress_response";
import { VocabularyEntity } from "../entities/vocabulary_entity";
import { ModeEntity } from "../entities/mode_entity";
import { VocabularyService } from "../services/vocabulary_service";
import { ModeService } from "../services/mode_service";



export class UserCourseController {

    public static async insertUserCourse(request: IInsertUserCourse, response: ResponseToolkit) {
        const payload = request.payload;
        const userId: string = request.auth.credentials.userId;
        try {
            const course = await CourseService.getCourseByName(payload.courseName);
            console.log(course);
            if (payload.interfaceLanguage.toLowerCase() == payload.courseName.toLowerCase()) {

                return Boom.badRequest(ErrorCodes.ERROR_COURSE_AND_INTERFACE_LANGUAGE_CANNOT_BE_THE_SAME)
            }
            if (!course) {

                return Boom.badRequest(ErrorCodes.ERROR_INVALID_COURSE)

            }

            const interfaceLanguage = await InterfaceLanguageService.getLanguageByName(payload.interfaceLanguage);
            if (!interfaceLanguage) {

                return Boom.badRequest(ErrorCodes.ERROR_INVALID_LANGUAGE)

            }
            const user = await UserService.getUserById(userId);
            if (!user) {

                return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST)
            }
            let userCourse: UserCourseEntity = new UserCourseEntity();


            userCourse.course = course;
            userCourse.interfaceLanguage = interfaceLanguage;
            userCourse.user = user;

            let vocabulary: VocabularyEntity = new VocabularyEntity();
            let mode: ModeEntity = new ModeEntity();
            mode.vocabulary = await VocabularyService.save(vocabulary);

            userCourse.mode = await ModeService.save(mode);

            const userCourseExists = await UserCourseService.checkUserCourseExistence(userCourse.course, user);
            if (userCourseExists) {
                return Boom.badRequest(ErrorCodes.ERROR_THIS_USER_ALREADY_LEARNING_THIS_COURSE);
            }
            const userCourseInstance = await UserCourseService.save(userCourse);
      


            return response.response({ message: Messages.MESSAGE_SUCCESS, savedUserCourse: userCourseInstance }).code(201)

        } catch (error) {
            console.log(error);
            return Boom.badImplementation();
        }


    }
    public static async getAvailableCourses(request: IRequest, response: ResponseToolkit): Promise<any> {
        const userId: string = request.auth.credentials.userId;
        try {

            if (!userId) {

                return Boom.badRequest(ErrorCodes.ERROR_MISSING_USER_ID);
            }
            var user: UserEntity = await UserService.getUserById(userId);
            if (!user) {
                return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);
            }
            var userCourses = await UserCourseService.getActiveUserCourses(user);
            var coursesInProgress: CourseEntity[] = [];
            var availableCourses: CourseEntity[] = await CourseService.getAllCourses();

            userCourses.forEach(element => {
                coursesInProgress.push(element.course);
            });
            var courses: CourseEntity[] = availableCourses.filter((course) => {

                return !coursesInProgress.some((c) => c.id === course.id);

            })



            return response.response({ courses });
        } catch (error) {
            console.log(error);
        }


    } public static async getCoursesProgress(request: IRequest, response: ResponseToolkit): Promise<any> {
        const userId: string = request.auth.credentials.userId;

        try {
            if (!userId) {

                return Boom.badRequest(ErrorCodes.ERROR_MISSING_USER_ID);
            }
            var user: UserEntity = await UserService.getUserById(userId);
            if (!user) {
                return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);
            }
            var activeCoursesData: UserCourseEntity[] = await UserCourseService.getActiveUserCourses(user);
            if (activeCoursesData.length == 0) {

                return response.response({ message: Messages.MESSAGE_USER_NO_ACTIVE_COURSES })
            }
            var currentUserCourse = user.profile.userCourse;



            var activeCourses = await getProgressForVocabulary(activeCoursesData,user);
            var currentCourse: ActiveCourseProgress | null = null;
            activeCourses!.forEach((e) => {

                if (e.activeCourse.userCourse.id == currentUserCourse.id) {
                    currentCourse = e;
                }

            })
            var res: ICourseProgressResponse = { activeCourses: activeCourses!, currentCourse: currentCourse! }
      
            return res;


        }




        catch (error) {
            console.log(error);
            return Boom.badImplementation();

        }
    }
    public static async getTotalKnownWords(request: IRequest, response: ResponseToolkit): Promise<any> {
        try {
            var vocabularyMode: ICourseProgressResponse = await UserCourseController.getCoursesProgress(request, response);

            var totalWords = 0;
            vocabularyMode.activeCourses.forEach(element => {
                totalWords += element.activeCourse.knownWords
            });
        
            return { totalWords: totalWords };

        } catch (error) {
            console.log(error);
            return Boom.badImplementation();
        }


    }
   
    
    public static async getCurrentCourseProgress(request: IRequest, response: ResponseToolkit): Promise<any> {
        const userId: string = request.auth.credentials.userId;
        try {
            if (!userId) {

                return Boom.badRequest(ErrorCodes.ERROR_MISSING_USER_ID);
            }
            var user: UserEntity = await UserService.getUserById(userId);
            if (!user) {
                return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);
            }
            var activeCoursesData: UserCourseEntity[] = await UserCourseService.getActiveUserCourses(user);
            if (activeCoursesData.length == 0) {

                return response.response({ message: Messages.MESSAGE_USER_NO_ACTIVE_COURSES })
            }

            var userCoursesProgress = await getProgressForVocabulary(activeCoursesData,user);


            const activeCourses: ActiveCourseProgress[] = [];
            userCoursesProgress!.map((e) => {
                if (e.activeCourse.userCourse.id == user.profile.userCourse.id) {
                    activeCourses.push(e);
                }

            })


            return response.response(activeCourses);
        } catch (error) {
            console.log(error);
            return Boom.badImplementation();
        }
    }


}