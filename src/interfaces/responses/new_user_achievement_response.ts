import { AchievementEntity } from "../../entities/achievement_entity";
import { UserAchievementsEntity } from "../../entities/user_achievements_entity";

export interface INewUserAchievementResponse {


    achieved: UserAchievementsEntity[]

}