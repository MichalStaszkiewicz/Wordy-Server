import Joi from 'joi';
import { UserAchievementsController } from '../controllers/user_achievements_controller';
import { server } from '../server';
import * as Hapi from '@hapi/hapi';
import { authValidate } from '../const/validation/validate_auth';
import { userAchievementsSchema } from '../const/validation/schemas';

export function user_achievements_init(server: Hapi.Server) {


    // Route to get user achievements
    server.route({
        method: 'GET',
        path: '/v1/user/achievements',
        options: {
            handler: UserAchievementsController.getAllUserAchievements,
            tags: ['api'],
            auth: 'jwt',
            description: 'Get user achievements',
            notes: 'Retrieve the achievements of a user based on the provided UUID.',
            validate: {
                headers: authValidate,
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'User achievements successfully retrieved',
                            schema: userAchievementsSchema,
                        },
                        '404': {
                            description: 'User not found',
                        },
                    },
                },
            },
        },
    });
}

