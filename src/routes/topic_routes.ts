
import * as Hapi from '@hapi/hapi';
import { authValidate } from '../const/validation/validate_auth';
import { RegisterationController } from '../controllers/registeration_controller';
import { TopicController } from '../controllers/topic_controller';
export function topics_init(server: Hapi.Server) {

    server.route({
        method: "GET",
        path: "/v1/topic/",
        options: {
            tags: ['api'],
            description: 'Update user registration status',
            notes: 'Update the registration status for a user by providing the UUID.',

            handler: TopicController.getAllTopics,
            auth: false,
        },
    });
}

