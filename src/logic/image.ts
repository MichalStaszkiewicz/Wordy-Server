import Boom from "boom";
import fs from "fs";
import { ResponseToolkit, Request } from "hapi";
import { ErrorCodes } from "../const/error_codes";
import path from "path";
export class ImageValidator {
  static validateExtension(imageName: string) {
    const allowedExtensions = [".gif", ".png", ".jpg", ".jpeg"];

    const hasValidExtension = allowedExtensions.some((ext) =>
      imageName.endsWith(ext)
    );

    if (!hasValidExtension) {
      return false;
    }
    return true;
  }
  static async exists(imageName: string) {
    const imagesDirectory = path.join(__dirname, "..", "..", "images");
    const imagePath = path.join(imagesDirectory, imageName);
    return fs.existsSync(imagePath);
  }
}
