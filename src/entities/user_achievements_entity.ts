import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany } from 'typeorm';
import { UserEntity } from './user_entity';
import { AchievementEntity } from './achievement_entity';
import { ProfileEntity } from './profile_entity';

@Entity('user_achievements')
export class UserAchievementsEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  progress!: number;
  @Column({ default: false })
  achieved!: boolean;
  @ManyToOne(() => AchievementEntity, achievement => achievement.id, { nullable: false })
  achievement!: AchievementEntity;
  @ManyToOne(() => ProfileEntity, profile => profile.id, { nullable: false })
  profile!: ProfileEntity


}
