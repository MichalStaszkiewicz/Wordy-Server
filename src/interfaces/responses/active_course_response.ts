import { ActiveCourseProgress } from "../model/active_course_progress"
import * as Hapi from '@hapi/hapi';
export interface IActiveCourseResponse extends Hapi.ResponseToolkit {

    activeCourses: ActiveCourseProgress[]





}