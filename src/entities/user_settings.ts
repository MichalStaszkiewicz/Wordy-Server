import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AchievementEntity } from './achievement_entity';


import { ProfileEntity } from './profile_entity';
import { UserEntity } from './user_entity';
import { InterfaceLanguageEntity } from './interface_language';
import * as uuid from 'uuid';
@Entity('user_settings')
export class UserSettingsEntity {
    constructor() {

        this.id = uuid.v4();
    }

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToOne(() => UserEntity)
    @JoinColumn()
    user!: UserEntity;

    @ManyToOne(() => InterfaceLanguageEntity, language => language.settings)
    interfaceLanguage!: InterfaceLanguageEntity;
}