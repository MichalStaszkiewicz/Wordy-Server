import Boom from "boom";
import { Request, ResponseToolkit } from 'hapi';

import { ErrorCodes } from "../const/error_codes";
import { InterfaceLanguageEntity } from "../entities/interface_language";
import { InterfaceLanguageRepository } from "../repositories/interface_language_repository";
import { InterfaceLanguageService } from "../services/interface_language_service";

export class InterfaceLanguageController {

    public static async getAllLanguages(request: Request, response: ResponseToolkit) {
        try {
            const languages: InterfaceLanguageEntity[] = await InterfaceLanguageService.getAllLanguages();

         
            return response.response({ "languages": languages }).code(200)


        } catch (error) {
            console.log(error);
            return Boom.badImplementation();
        }


    }
    
    public static async getAllLanguagesExcept(request: Request, response: ResponseToolkit) {
        const { languageName } = request.params as { languageName: string };
        try {
            if (!languageName) {

                return Boom.badRequest(ErrorCodes.ERROR_PARAMETERS_CANNOT_BE_EMPTY);
            }
            const language = await InterfaceLanguageService.getLanguageByName(languageName);

            if (!language) {
                return Boom.badRequest(ErrorCodes.ERROR_INVALID_LANGUAGE);
            }
            const languages: InterfaceLanguageEntity[] = await InterfaceLanguageService.getAllLanguagesExcept(languageName);
            return response.response({ "languages": [languages] }).code(200)


        } catch (error) {
            console.log(error);
            return Boom.badImplementation();
        }


    }
    public static async getLanguageByName(request: Request, response: ResponseToolkit) {
        const { languageName } = request.params as { languageName: string }
        try {
            if (!languageName) {
                return Boom.badRequest(ErrorCodes.ERROR_PARAMETERS_CANNOT_BE_EMPTY);
            }
            const language = await InterfaceLanguageService.getLanguageByName(languageName);

            if (!language) {
                return Boom.badRequest(ErrorCodes.ERROR_INVALID_LANGUAGE);
            }
            return response.response({ "languages": language }).code(200)
        } catch (error) {
            console.log(error);
            return Boom.badImplementation();
        }
    }
    public static async getLanguageById(request: Request, response: ResponseToolkit) {
        const { id } = request.params as { id: string }
        try {
            if (!id) {
                return Boom.badRequest(ErrorCodes.ERROR_PARAMETERS_CANNOT_BE_EMPTY);
            }
            const language = await InterfaceLanguageService.getLanguageById(parseInt(id));

            if (!language) {
                return Boom.badRequest(ErrorCodes.ERROR_INVALID_LANGUAGE);
            }
            return response.response({ "language": language }).code(200)
        } catch (error) {
            console.log(error);
            return Boom.badImplementation();
        }
    }
}