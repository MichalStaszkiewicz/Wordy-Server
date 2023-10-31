import { UserCourseEntity } from "../../entities/user_course_entity"
import { TopicProgress } from "./topic_progress";

export interface ActiveCourseProgress {
    activeCourse: {

        userCourse: UserCourseEntity;
        topicProgress: TopicProgress[];
        finishedTopics: number;
        knownWords: number;
        totalProgress: number;
        topicsCount: number;
        totalWordsCount: number;
    }

}