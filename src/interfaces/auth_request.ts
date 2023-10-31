import * as Hapi from '@hapi/hapi';
import { ICredentialsRequest } from './credential_request';

export interface IAuthRequest extends Hapi.RequestAuth {
    credentials: ICredentialsRequest;
}