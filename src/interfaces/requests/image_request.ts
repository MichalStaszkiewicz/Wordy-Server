import * as Hapi from '@hapi/hapi';
export interface IImageRequest extends Hapi.Request {

    payload: {

        image: {
            _data: []
            , hapi: { filename: string }

        }
    }

}