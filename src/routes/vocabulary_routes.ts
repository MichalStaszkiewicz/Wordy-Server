
import { server } from "../server";
import { authValidate } from "../const/validation/validate_auth";
import * as Hapi from '@hapi/hapi';
import { VocabularyController } from "../controllers/vocabulary_controller";
import Joi from "joi";
import { getKnownWordsByTopicSchema, insertKnownWordsSchema } from "../const/validation/schemas";

export function vocabulary_init(server: Hapi.Server) {
   
    server.route({
        method: "GET",
        path: "/v1/user/knownWords/get",
        options: {
            tags: ['api'],
            description: 'Get known words in current user course',
            notes: 'Get known words in current user course',
            validate: {

                headers: authValidate,
            },
            handler: VocabularyController.getKnownWords,
            auth: 'jwt',
        },
    });

    server.route({
        method: 'GET',
        path: '/v1/knownWords/get/by/topic/{topicName}',
        options: {
            tags: ['api'],
            description: 'Get flashcards from known words in current course by topic',
            validate: {
                params: getKnownWordsByTopicSchema,
                headers: authValidate,
            },
            handler: VocabularyController.getKnownWordsByTopic,
            auth: 'jwt',
        },
    });

    server.route({
        method: "POST",
        path: "/v1/user/knownWords/insert",
        options: {
            tags: ['api'],
            description: 'Insert a new known words',
            notes: 'insert a new known words into user account',
            validate: {
                payload: insertKnownWordsSchema,
                headers: authValidate,
            },
            handler: VocabularyController.insertKnownWords,
            auth: 'jwt',
        },
    });

}
