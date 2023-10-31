import * as Hapi from '@hapi/hapi';
import { IAuthRequest } from './auth_request';
export interface IRequest extends Hapi.Request {
    auth: IAuthRequest;
}