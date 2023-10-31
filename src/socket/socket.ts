
import { UserCourseService } from "../services/user_course_service";
import { server } from "../server";

import { Server, Socket } from 'socket.io';
import { UserCourseEntity } from "../entities/user_course_entity";
import { getProgressForVocabulary, hasUserAchievedWithoutRequest, hasUserCompletedLessonToday, hasUserCompletedLessonYesterday } from "../const/common";
import { ProfileService } from "../services/profile_service";
import { UserService } from "../services/user_service";
import { secretToken } from "../const/config"; import jwt from 'jsonwebtoken';
import Boom from "boom";
import { ErrorCodes } from "../const/error_codes";
import { generateToken, validateToken } from "../const/validation/validate_auth";
import { IRequest } from "../interfaces/request";
import { UserEntity } from "../entities/user_entity";
import { AchievementController } from "../controllers/achievement_controller";
import { AchievementService } from "../services/achievement_service";
import { UserAchievementsController } from "../controllers/user_achievements_controller";
import { AchievementEntity } from "../entities/achievement_entity";
import { INewUserAchievementResponse } from "../interfaces/responses/new_user_achievement_response";
import { UserStatisticsEntity } from "../entities/user_statistics_entity";
import { UserStatisticsService } from "../services/user_statistics_service";
import { TopicService } from "../services/topic_service";
import * as hapi from '@hapi/hapi';
import { InterfaceLanguageController } from "../controllers/language_controller";
import { InterfaceLanguageService } from "../services/interface_language_service";
export interface JwtPayload {
    userId: string;
    exp: number;

}
interface QuizSummary {
    token: string;
    topic: string;


}
interface RoomRefresh {

    oldToken: string;
    newToken: string;

}

export const authMiddleware = async (request: IRequest, h: hapi.ResponseToolkit) => {
    const token = request.headers;
  

    return h.continue;
};
export function initSocket() {
    let connectedClients = new Map<string, string>([

    ]);
    const io = require('socket.io')(server.listener, {

        cors: {
            origin: '*',
            allowedHeaders: '*',
        },

    });

    io.on('connection', (socket: Socket,) => {
        let state = false;
   
        socket.on('authenticate', async (token) => {

      

        });
        socket.use(async (packet: any, next: any) => {
            const headers = socket.handshake.headers;
            let token = headers.authorization;

            if (token != undefined) {
                try {
                    let verifiedToken = await jwt.verify(token, secretToken) as JwtPayload;
         
                    next();
                } catch (error) {
                    if (error instanceof jwt.TokenExpiredError) {




           
                        let userId: string = connectedClients.get(token)!;

                        let user: UserEntity = await UserService.getUserById(userId);
                        let verifiedToken = jwt.verify(user.refreshToken, secretToken) as JwtPayload;
                        const newToken = generateToken({ 'userId': verifiedToken.userId });
             

                        headers.authorization = newToken;

                        let roomData: RoomRefresh = { newToken: newToken, oldToken: token! };
                        socket.leave(token!);
                        connectedClients.delete(token)
                        socket.join(newToken);
                        connectedClients.set(newToken, user.id);

                        io.to(newToken).emit('token_expired', { "token": newToken });
             



                        next();

                    } else {
                        console.log(error);
                        next();
                    }
                }
            } else {
      
                next();
            }
        });


        socket.on('joinRoom', (token) => {
       

            if (!connectedClients.has(token)) {
                var verifiedToken = jwt.verify(token, secretToken) as JwtPayload;
                connectedClients.set(token, verifiedToken.userId);


            }




            socket.join(token);
        });
        socket.on('quiz_summary', async (data) => {
            const headers = socket.handshake.headers;
            const requestData = data as QuizSummary;
            const verifiedToken = jwt.verify(headers.authorization!, secretToken) as JwtPayload;
            const user: UserEntity = await UserService.getUserById(verifiedToken.userId);
            if (!user) {
                return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST)
            }
        

            var achievementsData = await hasUserAchievedWithoutRequest(verifiedToken.userId) as INewUserAchievementResponse;
            var achievements = achievementsData.achieved;
    
            var hotStreak = 0;
            if (await hasUserCompletedLessonToday(user) == false && user.profile.statistics.dailyLesson == false) {
                var hasUserCompletedYesterDayLesson = await hasUserCompletedLessonYesterday(user);
                if (hasUserCompletedYesterDayLesson) {
                    var currentHotStreak = user.profile.statistics.hotStreak;
                    currentHotStreak++;
                    let todayDate = new Date();
                    const partial: Partial<UserStatisticsEntity> = ({
                        hotStreak: currentHotStreak,
                        dailyLesson: true,
                        lastLessonDate: todayDate

                    })
                    hotStreak = currentHotStreak;
                    await UserStatisticsService.update(partial, user.profile);
                } else {
                    let todayDate = new Date();
                    const partial: Partial<UserStatisticsEntity> = ({
                        hotStreak: 1,
                        dailyLesson: true, lastLessonDate: todayDate
                    })

                    await UserStatisticsService.update(partial, user.profile);
                }
            }
            const currentUserCourse = user.profile.userCourse;
            const topicEntity = await TopicService.getTopicByName(requestData.topic);


            const currentCoursePartial: Partial<UserCourseEntity> = ({
                lastTopic: topicEntity
            })


            await UserCourseService.update(currentCoursePartial, currentUserCourse.id!)
            io.to(headers.authorization).emit('got_new_achievement', { achievements, hotStreak: hotStreak })

        })
        socket.on('topic_screen_load_courses', async () => {
            const headers = socket.handshake.headers;

            let token = headers.authorization;
     
            const verifiedToken = jwt.verify(token!, secretToken) as JwtPayload;


      

            const user: UserEntity = await UserService.getUserById(verifiedToken.userId);
            var activeCoursesData: UserCourseEntity[] = await UserCourseService.getActiveUserCourses(user);

            var activeCourses = await getProgressForVocabulary(activeCoursesData, user);

            var currentUserCourse = user.profile.userCourse;

            var currentCourse;
            activeCourses!.forEach((e) => {

                if (e.activeCourse.userCourse.id == currentUserCourse.id) {
                    currentCourse = e;
                }

            });
    
            io.to(token).emit('loadCourses', { activeCourses, currentCourse })


        })

        socket.on('add_course', async (token, course) => {
            try {
                const verifiedToken = jwt.verify(token, secretToken) as JwtPayload;
           
                const user: UserEntity = await UserService.getUserById(verifiedToken.userId);
                const courses = await UserCourseService.getActiveUserCourses(user);

             

                io.to(token).emit('updated_course_list', courses);
            } catch (error) {
                console.error('Error adding course:', error);
            }
        });


        socket.on('load_current_course', async () => {
            const headers = socket.handshake.headers;
            const verifiedToken = jwt.verify(headers.authorization!, secretToken) as JwtPayload;
     
            const user: UserEntity = await UserService.getUserById(verifiedToken.userId);





            var activeCoursesData: UserCourseEntity[] = await UserCourseService.getActiveUserCourses(user);

            if (activeCoursesData.length == 0) {

             
            }
            var activeCourses = await getProgressForVocabulary(activeCoursesData, user);
            var activeCourse;
            activeCourses!.forEach((e) => {

                if (e.activeCourse.userCourse.id == user.profile.userCourse.id) {
                    activeCourse = e;
                }

            })

       
            io.to(headers.authorization!).emit('current_course', { activeCourse });
        });
        socket.on('token_refresh', (data) => {

            var tokens = data as RoomRefresh;
            socket.leave(tokens.oldToken);
          
            socket.join(tokens.newToken);

        });
        socket.on('logout', (token) => {
            io.to(token).emit('logout_success', { message: "Logged Out Succesfully" });

            socket.leave(token);
       
        });
        socket.on('disconnect', () => {
            console.log('client disconnected');
        });
    });

}