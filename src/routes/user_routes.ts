import { server } from '../server';
import { UserController } from '../controllers/user_controller';
import * as Joi from 'joi';
import { RegisterationController } from '../controllers/registeration_controller';
import { UserSettingsController } from '../controllers/user_settings_controller';
import { ProfileController } from '../controllers/profile_controller';
import { authValidate } from '../const/validation/validate_auth';
import * as Hapi from '@hapi/hapi';
import { registerUserPayloadSchema, loginUserPayloadSchema, recoverUserPayloadSchema, confirmUserResetPasswordTokenPayloadSchema, updateUserPasswordPayloadSchema } from '../const/validation/schemas';

export function user_init(server: Hapi.Server) {
  
  
    // Route to register a user
    server.route({
        method: 'POST',
        path: '/v1/user/register',
        options: {
            tags: ['api'],
            description: 'Register a user',
            auth: false,
            notes: 'Registers a user with the server',
            validate: {
                payload: registerUserPayloadSchema,
            },
            handler: UserController.registerUser,
        },
    });

    // Route to login a user
    server.route({
        method: 'POST',
        path: '/v1/user/login',
        options: {
            tags: ['api'],
            description: 'User login',
            auth: false,
            notes: 'Logs in a user',
            handler: UserController.loginUser,
            validate: {
                payload: loginUserPayloadSchema,
            },
        },
    });

    // Route to recover a user's account
    server.route({
        method: 'POST',
        path: '/v1/user/recover',
        options: {
            tags: ['api'],
            description: 'Recover user account',
            auth: false,
            notes: 'Recovers a user account by email',
            handler: UserController.recoverUser,
            validate: {
                payload: recoverUserPayloadSchema,
            },
        },
    });

    // Route to validate the reset password token for a user
    server.route({
        method: 'POST',
        path: '/v1/user/validateResetPassword',
        options: {
            tags: ['api'],
            description: 'Validate reset password token',
            auth: false,
            notes: 'Validates the reset password token for a user',
            handler: UserController.confirmUserResetPasswordToken,
            validate: {
                payload: confirmUserResetPasswordTokenPayloadSchema,
            },
        },
    });

    // Route to update the user's password
    server.route({
        method: 'POST',
        path: '/v1/user/updateUserPassword',
        options: {
            tags: ['api'],
            description: 'Update user password',
            auth: false,
            notes: 'Updates the password for a user',
            handler: UserController.updateUserPassword,
            validate: {
                payload: updateUserPasswordPayloadSchema,
            },
        },
    });
}
