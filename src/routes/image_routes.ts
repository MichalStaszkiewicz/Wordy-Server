import { ResponseToolkit, Request } from "hapi";
import { ImageController } from "../controllers/image_controller";
import { server } from "../server";
import Boom from "boom";
import Path from "path";
import fs from 'fs';
import { Readable } from "typeorm/platform/PlatformTools";
import Joi from "joi";
import * as Hapi from '@hapi/hapi';
import { imageNameSchema } from "../const/validation/schemas";

export function image_init(server: Hapi.Server) {
  // Route to get a list of all images
  server.route({
    method: "GET",
    path: "/v1/images/",
    options: {
      auth: false,
      tags: ['api'],
      description: 'Retrieve a list of all images',
      handler: ImageController.getAllImages,
    },
  });

  // Route to get an image by the given image name
  server.route({
    method: "GET",
    path: "/v1/images/{imageName}",
    options: {
      handler: ImageController.getImage,
      tags: ['api'],
      auth: false,
      description: 'Retrieve an image by the given image name',
      validate: {
        params: imageNameSchema
      },
    },
  });

  // Home page route
  server.route({
    method: 'GET',
    path: '/',
    options: {
      handler: (request: Request, response: ResponseToolkit) => {
        return `
          <html>
            <body>
              <form action="/upload" method="post" enctype="multipart/form-data">
                <input type="file" name="image" />
                <input type="submit" value="Upload" />
              </form>
            </body>
          </html>
        `;
      },
      description: 'Home page',
    },
  });

  // Route to upload an image and save it on the server
  server.route({
    method: 'POST',
    path: '/upload',
    options: {
      handler: ImageController.uploadImage,
      payload: {
        maxBytes: 209715200,
        output: 'stream',
        multipart: {
          output: 'file',
        },
      },
      description: 'Upload an image and save it on the server',
    },
  });
}

// Validation schema for the image name parameter
