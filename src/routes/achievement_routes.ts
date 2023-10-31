import { server } from '../server';
import { AchievementController } from '../controllers/achievement_controller';
import Joi from 'joi';
import { achievementIdSchema } from '../const/validation/schemas';




export function achievement_init() {
    server.route({
        method: "GET",
        path: "/v1/achievements",
        handler: AchievementController.getAllAchievements,
        options: {
            tags: ['api'],
        }
    });

    server.route({
        method: "GET",
        path: "/v1/achievements/{id}",
        options: {
            tags: ['api'],
            validate: {
                params: achievementIdSchema,
            },
        },
        handler: AchievementController.getAchievementById
    });
}


