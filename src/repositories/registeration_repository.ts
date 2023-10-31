import { Not, UpdateResult } from "typeorm";
import { dataSource } from "..";
import { InterfaceLanguageEntity } from "../entities/interface_language";
import { UserEntity } from "../entities/user_entity";
import { UserSettingsEntity } from "../entities/user_settings";
import { RegisterationEntity } from "../entities/registeration_entity";


export class RegisterationRepository {
    public static async getRegisterationStatus(user: UserEntity): Promise<any> {
        return dataSource.getRepository(RegisterationEntity).findOne({
            where: {
                user: user,
            }
        })
    }
    public static async save(registerationInstance: RegisterationEntity): Promise<RegisterationEntity> {
        return dataSource.getRepository(RegisterationEntity).save(registerationInstance);
    }
    public static async update(user: UserEntity, data: Partial<RegisterationEntity>): Promise<UpdateResult> {
        return dataSource.getRepository(RegisterationEntity)
            .createQueryBuilder()
            .update(RegisterationEntity)
            .set(data)
            .where({ user })
            .execute();
    }


}