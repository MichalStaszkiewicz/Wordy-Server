import * as Hapi from '@hapi/hapi';
export interface IUpdateRegisterStatusRequest extends Hapi.Request {

    payload: {
        userId: string,
      
    }
}