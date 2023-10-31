import { Not, UpdateResult } from "typeorm";
import { dataSource } from "..";
import { InterfaceLanguageEntity } from "../entities/interface_language";
import { UserEntity } from "../entities/user_entity";
import { UserSettingsEntity } from "../entities/user_settings";
import { RegisterationEntity } from "../entities/registeration_entity";
import { RegisterationRepository } from "../repositories/registeration_repository";


export class RegisterationService {
    public static async getRegisterationStatus(user: UserEntity): Promise<any> {
        return RegisterationRepository.getRegisterationStatus(user)
    }
    public static async save(registerationInstance: RegisterationEntity): Promise<RegisterationEntity> {
        return RegisterationRepository.save(registerationInstance);
    }
    public static async update(user: UserEntity, data: Partial<RegisterationEntity>): Promise<UpdateResult> {
        return RegisterationRepository.update(user, data);
    }


}