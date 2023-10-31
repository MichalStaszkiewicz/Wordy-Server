import { dataSource } from "..";
import { CourseEntity } from "../entities/course_entity";

export class CourseRepository {
    public static async getAllCourses(): Promise<any> {

        return dataSource.getRepository(CourseEntity).find();

    }
    public static async getCourseById(id: number): Promise<any> {
        return dataSource.getRepository(CourseEntity).findOne({
            where: {

                id: id,
            }
        })

    }
    public static async getCourseByName(name: string): Promise<any> {
        return dataSource.getRepository(CourseEntity).findOne({
            where: {

                name: name,
            }
        })

    }

   
}