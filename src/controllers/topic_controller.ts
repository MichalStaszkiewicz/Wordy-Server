import Boom from "boom";
import { ResponseToolkit } from "hapi";
import { JwtPayload } from "jsonwebtoken";
import { secretToken } from "../const/config";
import { ErrorCodes } from "../const/error_codes";
import { generateToken } from "../const/validation/validate_auth";
import { TopicService } from "../services/topic_service";


export class TopicController {

    public static async getAllTopics(request: any, response: ResponseToolkit) {

        try {



            const topics = await TopicService.getAllTopics();

            return response.response({ topics: topics })


        } catch (error) {
            console.log(error);
            return Boom.badImplementation();
        }


    }

}