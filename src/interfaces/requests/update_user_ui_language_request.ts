import * as Hapi from '@hapi/hapi';
import { IRequest } from '../request';
export interface IUpdateUserInterfaceLanguageRequest extends IRequest {

    payload: {


        languageName: string,
    }
}