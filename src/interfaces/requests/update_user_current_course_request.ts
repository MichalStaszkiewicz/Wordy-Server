import * as Hapi from '@hapi/hapi';
import { IRequest } from '../request';
export interface IUpdateUserCurrentCourseRequest extends IRequest {

    payload: {

        courseName: string,
    }
}