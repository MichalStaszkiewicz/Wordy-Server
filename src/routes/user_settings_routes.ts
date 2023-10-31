import { server } from '../server';
import { UserController } from '../controllers/user_controller';
import * as Joi from 'joi';
import { UserSettingsController } from '../controllers/user_settings_controller';
import { authValidate } from '../const/validation/validate_auth';
import * as Hapi from '@hapi/hapi';
import { updateInterfaceLanguageSchema } from '../const/validation/schemas';
export function settings_init(server: Hapi.Server) {
 
    server.route({
        method: "GET",
        path: "/v1/user/settings/get",
        options: {
            handler: UserSettingsController.getUserSettings, auth: 'jwt',
            tags: ['api'],
            description: 'Get user settings',
            notes: 'Retrieve user settings by providing the user ID',
            validate: {

                headers: authValidate,
            },


        },


    });

    server.route({
        method: "PUT",
        path: "/v1/user/update/language",
        options: {
            handler: UserSettingsController.updateUserInterfaceLanguage,
            tags: ['api'],
            description: 'Update user interface language',
            notes: 'Update the interface language for a user by providing the user ID and the new language name',
            validate: {
                payload: updateInterfaceLanguageSchema,
                headers: authValidate,
            },
            auth: {
                strategy: 'jwt',
            }
        },

    });


}
