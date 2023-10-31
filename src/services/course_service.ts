import { dataSource } from "..";
import { CourseEntity } from "../entities/course_entity";
import { CourseRepository } from "../repositories/course_repository";

export class CourseService {
    public static getAllCourses(): Promise<CourseEntity[]> {
        return CourseRepository.getAllCourses();

    }

    public static async getCourseById(id: number): Promise<any> {
        return CourseRepository.getCourseById(id);

    }
    public static async getCourseByName(name: string): Promise<any> {
        return CourseRepository.getCourseByName(name);

    }
}