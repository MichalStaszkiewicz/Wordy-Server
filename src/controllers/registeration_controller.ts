import Boom from "boom";
import { ResponseToolkit, Request } from "hapi";
import { ErrorCodes } from "../const/error_codes";
import { RegisterationEntity } from "../entities/registeration_entity";
import { UserEntity } from "../entities/user_entity";
import { RegisterationRepository } from "../repositories/registeration_repository";
import { UserRepository } from "../repositories/user_repository";
import { IUpdateRegisterStatusRequest } from "../interfaces/requests/update_register_status_request";
import { Messages } from "../const/messages";
import { UserService } from "../services/user_service";
import { RegisterationService } from "../services/registeration_repository";
import { IRequest } from "../interfaces/request";
import { ICredentialsRequest } from "../interfaces/credential_request";


export class RegisterationController {

    public static async getRegisterationStatus(request: IRequest, response: ResponseToolkit) {


        try {

            const userId: string = request.auth.credentials.userId;
            if (!userId) {
                return Boom.badRequest(ErrorCodes.ERROR_MISSING_USER_ID);
            }

            const user: UserEntity = await UserService.getUserById(userId);
            if (!user) {

                return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);

            }
            const registeration_completed: RegisterationEntity = await RegisterationService.getRegisterationStatus(user);

            return response.response({ registerationCompleted: registeration_completed.registerationCompleted, id: registeration_completed.id, }).code(200);


        } catch (error) {
            console.log(error);
            return Boom.badImplementation();
        }

    }

    public static async updateUserRegisterationStatus(request: IRequest, response: ResponseToolkit) {
        const userId: string = request.auth.credentials.userId;
        try {



            if (!userId) {
                return Boom.badRequest(ErrorCodes.ERROR_MISSING_USER_ID);
            }

            const user: UserEntity = await UserService.getUserById(userId);
            if (!user) {
                return Boom.badRequest(ErrorCodes.ERROR_USER_DOES_NOT_EXIST);

            }

            const partial: Partial<RegisterationEntity> = {
                registerationCompleted: true
            };

            await RegisterationService.update(user, partial);
            const registerationCompleted = await RegisterationService.getRegisterationStatus(user);
            return response.response({ message: Messages.MESSAGE_SUCCESS, updatedRegisterStatus: registerationCompleted.registerationCompleted }).code(200)

        } catch (error) {
            console.log(error);
            return Boom.badImplementation();

        }


    }

}