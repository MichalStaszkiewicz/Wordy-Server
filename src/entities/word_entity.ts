import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { TopicEntity } from "./topic_entity";

@Entity("word")
export class WordEntity {
  @PrimaryGeneratedColumn({})
  id?: number;



  @Column({ nullable: false, name: "polish", unique: true })
  polish!: string;

  @Column({ nullable: false, name: "english", unique: true })
  english!: string;

  @Column({ nullable: false, name: "spanish", unique: true })
  spanish!: string;

  @Column({ nullable: false, name: "french", unique: true })
  french!: string;

  @Column({ nullable: false, name: "italian", unique: true })
  italian!: string;

  @Column({ nullable: false, name: "german", unique: true })
  german!: string;

  @Column({ nullable: false, name: "japanese", unique: true })
  japanese!: string;

  @Column({ nullable: false, name: "arabic", unique: true })
  arabic!: string;

  @Column({ nullable: false, name: "russian", unique: true })
  russian!: string;

  @Column({ nullable: false, name: "chinese", unique: true })
  chinese!: string;

  @Column({ nullable: false, name: "turkish", unique: true })
  turkish!: string;

 
  @Column({ nullable: false, name: "hindi", unique: true })
  hindi!: string;

  @Column({ nullable: false, name: "korean", unique: true })
  korean!: string;

 

  @ManyToOne(() => TopicEntity)
  @JoinColumn({})
  topic!: TopicEntity;
}
