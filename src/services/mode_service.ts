
import { ModeEntity } from "../entities/mode_entity";
import { ModeRepository } from "../repositories/mode_repository";


export class ModeService {

    public static async save(mode: ModeEntity): Promise<any> {

        return ModeRepository.save(mode);
    }

}