import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user_entity";
import { CourseEntity } from "./course_entity";
import { WordEntity } from "./word_entity";

@Entity("topic")
export class TopicEntity {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column()
    name!: string;
    @Column()
    image!: string;
    @OneToMany(() => WordEntity, word => word.topic)
    word!: WordEntity;
}