
import * as Hapi from '@hapi/hapi';
export interface UpdateUserPassword extends Hapi.Request {

    payload: {


        email: string,
        newPassword: string

    }
}