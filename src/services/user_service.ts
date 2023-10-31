import Boom from "boom";
import { InterfaceLanguageRepository } from "../repositories/interface_language_repository";
import { RegisterationRepository } from "../repositories/registeration_repository";
import { ErrorCodes } from "../const/error_codes";
import { Messages } from "../const/messages";
import { InterfaceLanguageEntity } from "../entities/interface_language";
import { ProfileEntity } from "../entities/profile_entity";
import { UserEntity } from "../entities/user_entity";
import { UserSettingsEntity } from "../entities/user_settings";
import { ProfileRepository } from "../repositories/profile_repository";
import { UserRepository } from "../repositories/user_repository";
import { UserSettingsRepository } from "../repositories/user_settings_repository";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

export class UserService {
  public static async createUser(user: UserEntity): Promise<any> {
    return UserRepository.save(user);
  }
  public static async update(
    data: Partial<UserEntity>,
    user: UserEntity
  ): Promise<any> {
    return UserRepository.update(data, user);
  }
  public static async getAll(): Promise<UserEntity[]> {
    return UserRepository.getAll();
  }
  public static async getUserByEmail(email: string): Promise<any> {
    return UserRepository.getUserByEmail(email);
  }
  public static async getUserById(id: string): Promise<any> {
    return UserRepository.getUserById(id);
  }
}
