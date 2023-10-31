import Boom from "boom";
import fs from "fs";
import { ResponseToolkit, Request } from "hapi";
import { ErrorCodes } from "../const/error_codes";
import path from "path";
import { Readable } from "typeorm/platform/PlatformTools";
import * as Hapi from "@hapi/hapi";

import { Messages } from "../const/messages";
import { IImageRequest } from "../interfaces/requests/image_request";
import { ImageValidator } from "../logic/image";
export class ImageController {
  public static async getAllImages(request: Request, h: ResponseToolkit) {
    const path = require("path");
    const imagesDirectory = path.join(__dirname, "..", "..", "images");

    try {
      const files = fs.readdirSync(imagesDirectory);
      const images = files
        .filter((file) => /\.(jpe?g|png|gif)$/i.test(file))
        .map((file) => {
          const name = file;
          const url = `/v1/images/${file}`;
          return { name, url };
        });

      const imageListHTML = images
        .map((image) => {
          return `<li><a href="${image.url}">${image.name}</a></li>`;
        })
        .join("");

      return `
            <html>
              <body>
                <ul>${imageListHTML}</ul>
              </body>
            </html>
          `;
    } catch (error) {
      console.error(error);
      return h
        .response("An error occurred while retrieving the images")
        .code(500);
    }
  }
  public static async getImage(request: Request, response: ResponseToolkit) {
    const imagesDirectory = path.join(__dirname, "..", "..", "images");
    const imageName = request.params.imageName;
    const validate: boolean = ImageValidator.validateExtension(imageName);

    if (!validate) {
      return Boom.badRequest(ErrorCodes.ERROR_INVALID_IMAGE_EXTENSION);
    }
    try {
      const imagePath = path.join(imagesDirectory, imageName);

      if (!ImageValidator.exists(imageName)) {
        return Boom.badRequest(ErrorCodes.ERROR_INVALID_IMAGE_PATH);
      }

      const imageExtension = path.extname(imagePath).toLowerCase();
      const imageData = fs.readFileSync(imagePath);

      let contentType;
      switch (imageExtension) {
        case ".jpg":
        case ".jpeg":
          contentType = "image/jpeg";
          break;
        case ".png":
          contentType = "image/png";
          break;
        default:
          contentType = "application/octet-stream";
          break;
      }

      return response.response(imageData).type(contentType).code(200);
    } catch (error) {
      console.error(error);
      return Boom.badImplementation();
    }
  }
  public static async uploadImage(
    request: IImageRequest,
    response: ResponseToolkit
  ) {
    const payload = request.payload;
    if (
      !payload ||
      !payload.image ||
      !payload.image._data ||
      !payload.image._data
    ) {
      throw Boom.badRequest(ErrorCodes.ERROR_INVALID_PAYLOAD);
    }
    try {
      const imageData = Buffer.from(payload.image._data);
      const originalFilename = request.payload.image.hapi.filename;
      const fileExtension = path.extname(originalFilename);
      const filenameWithoutExtension = path.basename(
        originalFilename,
        fileExtension
      );
      const filename = filenameWithoutExtension + fileExtension;
      const imageFilePath = path.join(__dirname, "../../images", filename);
      fs.writeFileSync(imageFilePath, imageData);
    } catch (error) {
      console.log(error);
      return response.response({ error: error });
    }

    return response.response({ message: Messages.MESSAGE_SUCCESS });
  }
}
