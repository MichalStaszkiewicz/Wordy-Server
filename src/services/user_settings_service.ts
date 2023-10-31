import { dataSource } from "..";
import { InterfaceLanguageEntity } from "../entities/interface_language";
import { UserEntity } from "../entities/user_entity";
import { UserSettingsEntity } from "../entities/user_settings";
import { UserSettingsRepository } from "../repositories/user_settings_repository";

export class UserSettingsService {
    public static async updateInterfaceLanguage(user: UserEntity, language: Partial<UserSettingsEntity>): Promise<any> {
        return UserSettingsRepository.update(user, language,)
    }
    public static async save(settings: UserSettingsEntity): Promise<any> {
        return UserSettingsRepository.save(settings)
    }
    public static async getUserSettings(user: UserEntity): Promise<any> {

        return UserSettingsRepository.getUserSettings(user);

    }

    public static async getUserInterfaceLanguage(user: UserEntity): Promise<any> {


        return UserSettingsRepository.getUserInterfaceLanguage(user);
    }

}