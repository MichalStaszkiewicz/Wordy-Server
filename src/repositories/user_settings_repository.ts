import { UpdateResult } from "typeorm";
import { dataSource } from "..";
import { InterfaceLanguageEntity } from "../entities/interface_language";
import { UserEntity } from "../entities/user_entity";
import { UserSettingsEntity } from "../entities/user_settings";

export class UserSettingsRepository {
    public static async update(user: UserEntity, data: Partial<UserSettingsEntity>): Promise<UpdateResult> {
        return dataSource.getRepository(UserSettingsEntity)
            .createQueryBuilder()
            .update(UserSettingsEntity)
            .set(data)
            .where({ user })
            .execute();
    }
    public static async save(settings: UserSettingsEntity): Promise<any> {
        return dataSource.getRepository(UserSettingsEntity).save(settings);
    }
    public static async getUserSettings(user: UserEntity): Promise<any> {

        return dataSource.getRepository(UserSettingsEntity).findOne({
            where: {
                user: user,

            }, relations: {
                interfaceLanguage: true,
                user: {

                    profile: {
                        userCourse: true,
                    },

                },

            }
        })

    }

    public static async getUserInterfaceLanguage(user: UserEntity): Promise<any> {


        return dataSource.getRepository(UserSettingsEntity)
            .createQueryBuilder('user_settings')
            .leftJoinAndSelect('user_settings.interfaceLanguage', 'interfaceLanguage')
            .select('interfaceLanguage.id', 'id')
            .addSelect('interfaceLanguage.name', 'name')
            .addSelect('interfaceLanguage.image', 'image')
            .where('user_settings.user = :userId', { userId: user.id })
            .getRawOne();
    }

}