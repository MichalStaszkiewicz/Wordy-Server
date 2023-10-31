import * as Hapi from '@hapi/hapi';
export interface RecoverAccountConfirmTokenRequest extends Hapi.Request {

    payload: {


        email: string,
        token: string

    }
}