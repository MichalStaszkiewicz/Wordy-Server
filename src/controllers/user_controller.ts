import { Request, ResponseToolkit } from 'hapi';
import { WordEntity } from '../entities/word_entity';
import { UserRepository } from '../repositories/user_repository';
import { ErrorCodes } from '../const/error_codes';
import { UserEntity } from '../entities/user_entity';
import { Messages } from '../const/messages';
import * as bcrypt from 'bcrypt';
import Boom from 'boom';


import { InterfaceLanguageController } from './language_controller';
import { InterfaceLanguageRepository } from '../repositories/interface_language_repository';
import { IRegisterUserRequest } from '../interfaces/requests/register_user_request';
import { ILoginUserRequest } from '../interfaces/requests/login_user_request';



import { WordRepository } from '../repositories/word_repository';



import { UserSettingsEntity } from '../entities/user_settings';
import { RegisterationRepository } from '../repositories/registeration_repository';
import { UserSettingsRepository } from '../repositories/user_settings_repository';
import { ProfileRepository } from '../repositories/profile_repository';
import { CourseEntity } from '../entities/course_entity';
import { UserCourseRepository } from '../repositories/user_course_repository';
import { CourseRepository } from '../repositories/course_repository';
import { UserCourseEntity } from '../entities/user_course_entity';

import { RegisterationEntity } from '../entities/registeration_entity';
import { ProfileEntity } from '../entities/profile_entity';
import { InterfaceLanguageEntity } from '../entities/interface_language';
import { getConnection } from 'typeorm';
import { dataSource } from '..';
import { ProfileService } from '../services/profile_service';
import { UserService } from '../services/user_service';
import { InterfaceLanguageService } from '../services/interface_language_service';
import { UserSettingsService } from '../services/user_settings_service';
import { RegisterationService } from '../services/registeration_repository';

import { generateToken } from '../const/validation/validate_auth';
import { UserAchievementService } from '../services/user_achievements_service';
import { AchievementService } from '../services/achievement_service';
import { UserAchievementsEntity } from '../entities/user_achievements_entity';
import { UserStatisticsEntity } from '../entities/user_statistics_entity';
import { UserStatisticsService } from '../services/user_statistics_service';
import { secretToken } from '../const/config';
const jwt = require('jsonwebtoken');

import nodemailer from 'nodemailer';
import { RecoverAccountRequest } from '../interfaces/requests/recover_account_request';
import { RecoverAccountConfirmTokenRequest } from '../interfaces/requests/recover_accont_confirm_token_request';
import { UpdateUserPassword } from '../interfaces/requests/update_user_password';
import { UserUtils } from '../logic/user';
interface RecoverAccountData {

    token: string;

}
export class UserController {



    public static async registerUser(request: IRegisterUserRequest, response: ResponseToolkit) {
        const payload = request.payload;

        try {
            const connection = getConnection();


            if (!payload.email || !payload.fullName || !payload.password) {
                return Boom.badRequest(ErrorCodes.ERROR_PARAMETERS_CANNOT_BE_EMPTY)
            }

            if (!(UserUtils.validateEmail(payload.email))) {
                return Boom.badRequest(ErrorCodes.ERROR_INVALID_EMAIL_OR_PASSWORD)
            }
            const existingUser = await UserService.getUserByEmail(payload.email)
            if (existingUser) {
                console.log("User with that email already exists")
                return Boom.badRequest(ErrorCodes.ERROR_USER_WITH_EMAIL_EXISTS);
            }

            var achievements = await AchievementService.getAll();
            await connection.transaction(async (transactionalEntityManager) => {

                const newUser: UserEntity = new UserEntity();
                const hashedPassword = await bcrypt.hash(payload.password, 10);
                newUser.email = payload.email;
                newUser.password = hashedPassword;
                const refreshToken = jwt.sign({ userId: newUser.id }, secretToken, { expiresIn: '7d' });
                newUser.refreshToken = refreshToken;
                const profile = new ProfileEntity();
                profile.fullName = payload.fullName;
                newUser.profile = profile;
                var statistics: UserStatisticsEntity = new UserStatisticsEntity();
                statistics.profile = profile;


                const settings = new UserSettingsEntity();
                settings.user = newUser;


                await transactionalEntityManager.save(profile);



                const statisticsInstance = await transactionalEntityManager.save(statistics);



                for await (const achievement of achievements) {
                    var userAchievement = new UserAchievementsEntity();
                    userAchievement.achievement = achievement;
                    userAchievement.progress = 0;
                    userAchievement.profile = profile;
                    userAchievement.achieved = false;
                    await transactionalEntityManager.save(userAchievement);

                }



                const interfaceLanguage = await InterfaceLanguageService.getLanguageById(1);
                if (!interfaceLanguage) {
                    return Boom.badImplementation();
                }
                settings.interfaceLanguage = interfaceLanguage;


                const register = new RegisterationEntity();
                register.user = newUser;



                await transactionalEntityManager.save(newUser);
                await transactionalEntityManager.save(settings);
                await transactionalEntityManager.save(register);




                await transactionalEntityManager.update(ProfileEntity, profile.id, { settings: settings, statistics: statisticsInstance! });
            });
            console.log("User successfully created");
            return response.response({ message: Messages.MESSAGE_REGISTER_SUCCESS }).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badImplementation();
        }
    }






    public static async loginUser(request: ILoginUserRequest, response: ResponseToolkit) {
        const payload = request.payload;

        try {

            const user: UserEntity = await UserService.getUserByEmail(payload.email);
            if (!user) {
                return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);
            }
            const isPasswordCorrect = await bcrypt.compare(payload.password, user.password);
            if (!isPasswordCorrect) {
                return Boom.badRequest(ErrorCodes.ERROR_INVALID_EMAIL_OR_PASSWORD)
            }
            const accToken = generateToken({ userId: user.id });
            const refToken = user.refreshToken;


            return response.response({ message: Messages.MESSAGE_LOGIN_SUCCESSFULL, accessToken: accToken, refreshToken: refToken }).code(200);

        } catch (error) {
            console.log(error);
            return Boom.badImplementation();
        }


    }
    public static async updateUserPassword(request: UpdateUserPassword, response: ResponseToolkit) {

        const payload = request.payload;

        try {
            const user: UserEntity = await UserService.getUserByEmail(payload.email);
            if (!user) {
                return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);
            }

            let updatedPassword = await bcrypt.hash(payload.newPassword, 10);
            const partial: Partial<UserEntity> = {

                password: updatedPassword

            }

            await UserService.update(partial, user);
            return response.response({ message: "Password updated successfully" })
        } catch (error) {
            console.log(error)

            return Boom.badImplementation();
        }

    }
    public static async confirmUserResetPasswordToken(request: RecoverAccountConfirmTokenRequest, response: ResponseToolkit) {
        const payload = request.payload;
        try {
            const user: UserEntity = await UserService.getUserByEmail(payload.email);
            if (!user) {
                return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);
            }
            if (!user.resetPasswordToken) {
                return Boom.badRequest(ErrorCodes.ERROR_SKIPPED_RECOVER_STEPTS);
            }
            const verifiedToken = await jwt.verify(user.resetPasswordToken, secretToken);
            if (!verifiedToken) {


                console.log("Your reset password token has expired. Please try again.");
                return Boom.badRequest("Your reset password token has expired. Please try again.");
            }
            const tokenData = verifiedToken as RecoverAccountData;
            if (tokenData.token == payload.token) {

                return response.response({ message: "Success" });
            } else {

                return Boom.badRequest('Wrong Token')
            }


        } catch (error) {
            console.log(error);
            return Boom.badImplementation();
        }

    }
    public static async recoverUser(request: RecoverAccountRequest, response: ResponseToolkit) {
        const payload = request.payload;

        try {
            const user: UserEntity = await UserService.getUserByEmail(payload.email);
            if (!user) {
                return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);
            }
            let randomTokenPayload = Math.floor(Math.random() * 900000) + 100000;
            const token = await generateToken({ "token": randomTokenPayload });
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'PUT_EMAIL_TO_GOOGLE',
                    pass: 'PUT_PASSWORD_TO_EMAIL'
                }
            });

            const partial: Partial<UserEntity> = {
                resetPasswordToken: token
            };
           await UserService.update(partial, user);
          
            const mailOptions = {

                to: user.email,
                subject: 'Password Recovery',
                text: 'Here is your password reset token: ' + randomTokenPayload
            };

            try {
                const info = await transporter.sendMail(mailOptions);
                console.log('E-mail sent: ' + info.response);
                return response.response({ message: 'Password recovery e-mail sent.' });
            } catch (error) {
                console.log(error);
                return Boom.badImplementation();
            }
        } catch (error) {
            console.log(error);
            return Boom.badImplementation();
        }
    }



}
