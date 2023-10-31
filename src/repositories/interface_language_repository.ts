import { Not } from "typeorm";
import { dataSource } from "..";
import { InterfaceLanguageEntity } from "../entities/interface_language";


export class InterfaceLanguageRepository {

    public static async getAllLanguages(): Promise<InterfaceLanguageEntity[]> {
        return dataSource.getRepository(InterfaceLanguageEntity).find();


    }
    
    public static async getAllLanguagesExcept(name: string): Promise<InterfaceLanguageEntity[]> {
        return dataSource.getRepository(InterfaceLanguageEntity).find({
            where: {
                name: Not(name)

            }
        })


    }
    public static async getLanguageByName(name: string): Promise<InterfaceLanguageEntity | null> {
        return dataSource.getRepository(InterfaceLanguageEntity).findOne({
            where: {

                name: name

            }
        });

    }
    public static async getLanguageById(id: number): Promise<InterfaceLanguageEntity | null> {
        return dataSource.getRepository(InterfaceLanguageEntity).findOne({
            where: {

                id: id
            }
        });

    }
}