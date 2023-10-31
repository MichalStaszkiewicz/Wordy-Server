import Joi from "joi";
import { RegisterationController } from "../controllers/registeration_controller";
import { server } from "../server";
import { authValidate } from "../const/validation/validate_auth";
import * as Hapi from '@hapi/hapi';

export function registeration_init(server: Hapi.Server) {
    // Route to get user information
    server.route({
        method: "GET",
        path: "/v1/user/info/registerStatus",
        options: {
            tags: ['api'],
            description: 'Get user information',
            notes: 'Retrieve information about a user by providing the UUID.',
            validate: {
                headers: authValidate,
            },
            handler: RegisterationController.getRegisterationStatus,
            auth: 'jwt',
        },
    });

    // Route to update user registration status
    server.route({
        method: "PUT",
        path: "/v1/user/update/registerStatus",
        options: {
            tags: ['api'],
            description: 'Update user registration status',
            notes: 'Update the registration status for a user by providing the UUID.',
            validate: {
                headers: authValidate,
            },
            handler: RegisterationController.updateUserRegisterationStatus,
            auth: 'jwt',
        },
    });
}

