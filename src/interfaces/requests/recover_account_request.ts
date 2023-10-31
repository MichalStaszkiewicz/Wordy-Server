import * as Hapi from '@hapi/hapi';
export interface RecoverAccountRequest extends Hapi.Request {

    payload: {


        email: string,

    }
}