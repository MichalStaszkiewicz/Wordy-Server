import { dataSource } from "..";
import { ModeEntity } from "../entities/mode_entity";




export class ModeRepository {

    public static async save(mode: ModeEntity): Promise<any> {

        return dataSource.getRepository(ModeEntity).save(mode);

    }

}