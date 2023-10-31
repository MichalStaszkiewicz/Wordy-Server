import Joi from 'joi';
import { UserCourseController } from '../controllers/user_course_controller';
import { server } from '../server'
import { authValidate, validateToken } from '../const/validation/validate_auth';
import * as Hapi from '@hapi/hapi';
import { addUserCoursePayloadSchema } from '../const/validation/schemas';

export function user_course_init(server: Hapi.Server) {

   
    // Route to add a new course to the user
    server.route({
        method: 'POST',
        path: '/v1/user/course/add',
        options: {
            auth: 'jwt',
            handler: UserCourseController.insertUserCourse,
            description: 'Add a new course to the user',
            notes: 'This route allows adding a new course to the user.',
            tags: ['api'],
            validate: {
                payload: addUserCoursePayloadSchema,
                headers: authValidate,
            },
        },
    });

    // Route to get the current course progress of the user
    server.route({
        method: 'GET',
        path: '/v1/user/course/current/progress',
        options: {
            auth: 'jwt',
            handler: UserCourseController.getCurrentCourseProgress,
            description: 'Get current course progress',
            notes: 'This route retrieves the progress of the current course for the user.',
            tags: ['api'],
            validate: {
                headers: authValidate,
            },
        },
    });

    // Route to get the vocabulary progress of all courses for the user
    server.route({
        method: 'GET',
        path: '/v1/user/course/progress/vocabulary',
        options: {
            auth: 'jwt',
            handler: UserCourseController.getCoursesProgress,
            description: 'Get vocabulary progress for all courses',
            notes: 'This route retrieves the vocabulary progress of all courses for the user.',
            tags: ['api'],
            validate: {
                headers: authValidate,
            },
        },
    });

    // Route to get the total number of known words for the user's courses
    server.route({
        method: 'GET',
        path: '/v1/user/course/progress/vocabulary/totalWords',
        options: {
            auth: 'jwt',
            handler: UserCourseController.getTotalKnownWords,
            description: 'Get total number of known words',
            notes: 'This route retrieves the total number of known words for the user\'s courses.',
            tags: ['api'],
            validate: {
                headers: authValidate,
            },
        },
    });

    // Route to get the available courses for the user
    server.route({
        method: 'GET',
        path: '/v1/user/course/availableCourses',
        options: {
            auth: 'jwt',
            handler: UserCourseController.getAvailableCourses,
            description: 'Get available courses for the user',
            notes: 'This route retrieves the available courses for the user.',
            tags: ['api'],
            validate: {
                headers: authValidate,
            },
        },
    });
}
