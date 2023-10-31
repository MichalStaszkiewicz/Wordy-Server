import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('achievement')
export class AchievementEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, nullable: false })
  name!: string;

  @Column({ nullable: false })
  description!: string;

  @Column({ nullable: false })
  goal!: number;
  @Column({ nullable: false })
  type!: string;
}
