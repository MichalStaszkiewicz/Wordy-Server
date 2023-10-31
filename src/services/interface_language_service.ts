import { Not } from "typeorm";
import { dataSource } from "..";
import { InterfaceLanguageEntity } from "../entities/interface_language";
import { InterfaceLanguageRepository } from "../repositories/interface_language_repository";


export class InterfaceLanguageService {

    public static async getAllLanguages(): Promise<InterfaceLanguageEntity[]> {
        return InterfaceLanguageRepository.getAllLanguages();


    }
    public static async getAllLanguagesExcept(name: string): Promise<InterfaceLanguageEntity[]> {
        return InterfaceLanguageRepository.getAllLanguagesExcept(name);


    }
    public static async getLanguageByName(name: string): Promise<any> {
        return InterfaceLanguageRepository.getLanguageByName(name)

    }
    public static async getLanguageById(id: number): Promise<InterfaceLanguageEntity | null> {
        return InterfaceLanguageRepository.getLanguageById(id);

    }
}