import Joi = require('joi');
import * as Hapi from '@hapi/hapi';
import * as JWT from 'jsonwebtoken';
import { secretToken } from '../config';
import Boom = require('boom');
import { IValidateToken } from '../../interfaces/validate_token';
import { JwtPayload } from '../../socket/socket';
import { IRequest } from '../../interfaces/request';
import { ResponseToolkit } from 'hapi';
export function generateToken(payload: any): string {
//TODO change expiredsIn to 3h
    return JWT.sign(payload, secretToken, { expiresIn: '3h' });
}




export async function validateToken(decoded: JwtPayload, request: IRequest, response: ResponseToolkit) {
    const expirationTime = decoded.exp; 
    const currentTime = Math.floor(Date.now() / 1000); 
    const timeRemaining = expirationTime - currentTime;
    const encodedToken = JWT.sign(decoded, secretToken);
    const verifiedToken = await JWT.verify(encodedToken, secretToken);
    if (verifiedToken) {
        console.log("Token valid");
        console.log("Remaining time: "  + timeRemaining);
        return { isValid: true, credentials: { userId: decoded.userId } };
    } else {
        console.log("Token expired");
        return { isValid: false };
    }
}



export const authValidate = Joi.object({ 'authorization': Joi.string().required() }).options({ allowUnknown: true });