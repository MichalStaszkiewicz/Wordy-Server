import * as Hapi from '@hapi/hapi';
import { IRequest } from '../request';
export interface IAddUserAchievementRequest extends IRequest {

    payload: {

        achievementId: number
    }

}