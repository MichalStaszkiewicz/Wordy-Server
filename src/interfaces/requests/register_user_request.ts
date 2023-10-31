import * as Hapi from '@hapi/hapi';
export interface IRegisterUserRequest extends Hapi.Request {

    payload: {

        fullName: string,
        email: string,
        password: string,
    }
}