import * as Hapi from '@hapi/hapi';

export interface ICredentialsRequest extends Hapi.AuthCredentials {
    userId: string;
    [key: string]: any;

}

