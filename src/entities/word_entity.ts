import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { TopicEntity } from "./topic_entity";

@Entity('word')
export class WordEntity {
  @PrimaryGeneratedColumn({})
  id?: number;

  @ManyToOne(() => TopicEntity,)
  @JoinColumn()

  topic!: TopicEntity;

  @Column({ nullable: false, name: 'polish' })
  polish!: string;

  @Column({ nullable: false, name: 'english' })
  english!: string;


  @Column({ nullable: false, name: 'spanish' })
  spanish!: string;

  @Column({ nullable: false, name: 'french' })
  french!: string;



}