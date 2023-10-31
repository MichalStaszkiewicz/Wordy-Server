import Joi from "joi";
import { InterfaceLanguageController } from "../controllers/language_controller";
import { server } from "../server";

import * as Hapi from '@hapi/hapi';
import { languageIdSchema, languageNameSchema } from "../const/validation/schemas";

export function langauge_init(server: Hapi.Server) {
    // Route to get all languages
    server.route({
        method: "GET",
        path: "/v1/languages",
        options: {
            auth: false,
            handler: InterfaceLanguageController.getAllLanguages,
            tags: ['api'],
            description: 'Get all languages',
            notes: 'This endpoint returns a list of all available languages.',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Success',
                        },
                    },
                },
            },
        },
    });

    // Route to get all languages except one
    server.route({
        method: "GET",
        path: "/v1/languages/except/{languageName}",
        options: {
            auth: false,
            handler: InterfaceLanguageController.getAllLanguagesExcept,
            tags: ['api'],
            description: 'Get all languages except one',
            notes: 'This endpoint returns a list of all available languages except the specified language.',
            validate: {
                params: languageNameSchema
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Success',
                        },
                    },
                },
            },
        },
    });

    // Route to get language by name
    server.route({
        method: "GET",
        path: "/v1/languages/by/name/{languageName}",
        options: {
            auth: false,
            handler: InterfaceLanguageController.getLanguageByName,
            tags: ['api'],
            description: 'Get language by name',
            notes: 'This endpoint returns the language with the specified name.',
            validate: {
                params: languageNameSchema
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Success',
                        },
                    },
                },
            },
        },
    });

    // Route to get language by ID
    server.route({
        method: "GET",
        path: "/v1/languages/by/id/{id}",
        options: {
            auth: false,
            handler: InterfaceLanguageController.getLanguageById,
            tags: ['api'],
            description: 'Get language by ID',
            notes: 'This endpoint returns the language with the specified ID.',
            validate: {
                params: languageIdSchema
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Success',
                        },
                    },
                },
            },
        },
    });
}

