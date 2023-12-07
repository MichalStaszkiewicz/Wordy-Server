import { ResponseToolkit } from "hapi";
import { IRequest } from "../interfaces/request";

import Boom from "boom";
import * as JWT from "jsonwebtoken";

import { generateToken } from "../const/validation/validate_auth";
import { ErrorCodes } from "../const/error_codes";
import { JwtPayload } from "jsonwebtoken";

export class TokenController {
  public static async refreshToken(request: any, response: ResponseToolkit) {
    try {
      
      const verifiedToken = JWT.verify(
        request.payload.token,
        process.env.SECRET!
      ) as JwtPayload;

      if (verifiedToken) {
        const newToken = await generateToken({ userId: verifiedToken.userId });
        return response.response({ token: newToken });
      } else {
        return Boom.badRequest(ErrorCodes.ERROR_INVALID_REFRESH_TOKEN);
      }
    } catch (error) {
      console.log(error);
      return Boom.badImplementation();
    }
  }
}
