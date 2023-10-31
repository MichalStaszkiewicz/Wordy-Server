import * as Hapi from '@hapi/hapi';
import { IRequest } from '../request';
export interface IInsertKnownWords extends IRequest {

    payload: {

        wordIdList: number[],
        
    }

}