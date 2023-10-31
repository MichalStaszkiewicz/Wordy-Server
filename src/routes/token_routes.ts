import * as Hapi from '@hapi/hapi';
import { authValidate } from '../const/validation/validate_auth';
import { TokenController } from '../controllers/token_controller';
import Joi from 'joi';
import { refreshTokenSchema } from '../const/validation/schemas';

export function token_init(server: Hapi.Server) {
    // Payload validation schema for refreshing user token
 
    // Route to refresh the user's token
    server.route({
        method: 'POST',
        path: '/v1/refreshToken',
        options: {
            tags: ['api'],
            description: 'Refresh user token',
            notes: 'This endpoint refreshes the user token by providing the refresh token.',
            validate: {
                payload: refreshTokenSchema,
            },
            handler: TokenController.refreshToken,
            auth: false,
        },
    });
}

