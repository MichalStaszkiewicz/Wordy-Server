import Joi from "joi";
import { ProfileController } from "../controllers/profile_controller";
import { server } from "../server";
import { authValidate } from "../const/validation/validate_auth";
import * as Hapi from '@hapi/hapi';
import { updateCurrentCourseSchema } from "../const/validation/schemas";

export function profile_init(server: Hapi.Server) {
    // Route to get user's current course
    server.route({
        method: "GET",
        path: "/v1/profile/course",
        options: {
            handler: ProfileController.getUserCurrentCourse,
            tags: ['api'],
            description: 'Get user\'s current course',
            notes: 'This endpoint retrieves the current course of the user identified by the userId parameter.',
            validate: {
                headers: authValidate,
            },
            auth: 'jwt',
        },
    });

    // Route to get user's profile data
    server.route({
        method: "GET",
        path: "/v1/profile/data",
        options: {
            handler: ProfileController.getUserProfileData,
            tags: ['api'],
            description: 'Get user\'s profile data',
            notes: 'This endpoint retrieves the profile data of the user identified by the userId parameter.',
            validate: {
                headers: authValidate,
            },
            auth: 'jwt',
        },
    });

    // Route to update user's current course
    server.route({
        method: "PUT",
        path: "/v1/user/update/currentCourse",
        options: {
            tags: ['api'],
            description: 'Update user\'s current course',
            notes: 'Pass the UUID of the user in order to update their current course.',
            validate: {
                payload: updateCurrentCourseSchema,
                headers: authValidate,
            },
            handler: ProfileController.updateUserCurrentCourse,
            auth: 'jwt',
        },
    });
}

 
