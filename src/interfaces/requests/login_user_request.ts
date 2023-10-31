import * as Hapi from '@hapi/hapi';
export interface ILoginUserRequest extends Hapi.Request {

    payload: {

        email: string,
        password: string,
    }
}