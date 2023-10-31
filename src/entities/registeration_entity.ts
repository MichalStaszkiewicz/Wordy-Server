import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user_entity";
import * as uuid from 'uuid';
@Entity('registeration')
export class RegisterationEntity {


    constructor() {

        this.id = uuid.v4();
    }

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToOne(() => UserEntity)
    @JoinColumn()
    user!: UserEntity;
    @Column()
    registerationCompleted: boolean = false;


}