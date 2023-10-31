import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user_entity";
import * as uuid from 'uuid';
import { ProfileEntity } from "./profile_entity";
@Entity('user_statistics')
export class UserStatisticsEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "boolean", default: false })
    dailyLesson: boolean = false;

    @OneToOne(() => ProfileEntity)
    @JoinColumn()
    profile!: ProfileEntity;

    @Column()
    hotStreak: number = 0;

    @Column({ nullable: true })
    lastLessonDate!: Date;
}