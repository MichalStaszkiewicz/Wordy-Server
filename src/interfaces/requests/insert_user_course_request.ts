import * as Hapi from '@hapi/hapi';
import { IRequest } from '../request';

export interface IInsertUserCourse extends IRequest {

    payload: {
     
        interfaceLanguage: string,
        courseName: string,
    }
}