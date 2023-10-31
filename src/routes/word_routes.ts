import { Connection } from 'typeorm';
import { WordController } from '../controllers/word_controller';
import * as Joi from 'joi';
import { server } from '../server';
import { authValidate } from '../const/validation/validate_auth';
import * as Hapi from '@hapi/hapi';
import { wordsByTopicParamsSchema, flashcardsByTopicParamsSchema, flashcardsParamsSchema } from '../const/validation/schemas';

export function word_init(server: Hapi.Server) {
    server.route({
        method: 'GET',
        path: '/v1/words',
        options: {
            auth: false,
            tags: ['api'],
            description: 'Get all words',
            notes: 'This endpoint returns all words available.',
            handler: WordController.getAllWords,
        },
    });

    server.route({
        method: 'GET',
        path: '/v1/words/{topicName}',
        options: {
            auth: false,
            validate: {
                params: wordsByTopicParamsSchema,
            },
            tags: ['api'],
            description: 'Get words by topic',
            notes: 'This endpoint returns words related to the specified topic.',
            handler: WordController.getWordsByTopic,
        },
    });

    server.route({
        method: 'GET',
        path: '/v1/words/flashCards/by/topic/{topicName}',
        options: {
            auth: "jwt",
            validate: {
                params: flashcardsByTopicParamsSchema,
                headers: authValidate,
            },
            tags: ['api'],
            description: 'Create flashcards for a topic',
            notes: 'This endpoint generates flashcards for the specified topic, interface language, and user.',
            handler: WordController.createFlashCards,
        },
    });

    server.route({
        method: 'GET',
        path: '/v1/words/flashCards/{topicName}',
        options: {
            auth: "jwt",
            validate: {
                params: flashcardsParamsSchema,
                headers: authValidate,
            },
            tags: ['api'],
            description: 'Get words for flashcards',
            notes: 'This endpoint retrieves words for flashcards based on the specified interface language and user. The words are suitable for beginner-level practice.',
            handler: WordController.getWordsForVocabularyQuiz,
        },
    });
}




