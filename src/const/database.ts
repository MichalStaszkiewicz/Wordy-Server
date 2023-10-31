import { createConnection, ConnectionOptions } from 'typeorm';
import { AchievementEntity } from '../entities/achievement_entity';
import { UserAchievementsEntity } from '../entities/user_achievements_entity';
import { UserEntity } from '../entities/user_entity';
import { WordEntity } from '../entities/word_entity';

import { InterfaceLanguageEntity } from '../entities/interface_language';
import { ProfileEntity } from '../entities/profile_entity';

import { TopicEntity } from '../entities/topic_entity';
import { UserSettingsEntity } from '../entities/user_settings';
import { CourseEntity } from '../entities/course_entity';
import { RegisterationEntity } from '../entities/registeration_entity';
import { UserCourseEntity } from '../entities/user_course_entity';

import { UserStatisticsEntity } from '../entities/user_statistics_entity';
import { VocabularyEntity } from '../entities/vocabulary_entity';
import { VocabularyWordEntity } from '../entities/vocabulary_word_entity';
import { ModeEntity } from '../entities/mode_entity';

export const connectionOptions: ConnectionOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: '1337',
  database: 'wordydb',
  entities: [WordEntity, UserStatisticsEntity, UserEntity, UserAchievementsEntity, AchievementEntity, InterfaceLanguageEntity, VocabularyEntity, ProfileEntity, VocabularyWordEntity, TopicEntity, UserSettingsEntity, CourseEntity, RegisterationEntity, UserCourseEntity, ModeEntity],
  synchronize: true,
};
