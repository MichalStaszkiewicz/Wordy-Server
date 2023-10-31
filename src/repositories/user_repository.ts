import { DataSource, EntityRepository, Repository } from 'typeorm';
import { dataSource } from '..';
import { UserEntity } from '../entities/user_entity';



export class UserRepository {


    public static async save(user: UserEntity): Promise<UserEntity> {


        return dataSource.getRepository(UserEntity).save(user);
    }
    public static async update(data: Partial<UserEntity>, user: UserEntity): Promise<any> {


        return dataSource.getRepository(UserEntity)
            .createQueryBuilder()
            .update(UserEntity)
            .set(data)
            .where({ id: user.id })
            .execute();
    }

    public static async getUserByEmail(email: string): Promise<any> {


        return dataSource.getRepository(UserEntity).findOne({
            where: { email }, relations: {

                profile: {
                    userCourse: {
                        interfaceLanguage: true,

                    },

                }
            }
        });
    }
    public static async getUserById(userId: string): Promise<any> {


        return dataSource.getRepository(UserEntity).findOne({
            where: {

                id: userId,
            }, relations: {
                profile: {
                    settings: {

                        interfaceLanguage: true,
                    },
                    statistics: true,
                    userCourse: {
                        course:true,
                        interfaceLanguage:true,
                        mode:{
vocabulary:true

                        },
                        lastTopic:true,
                    },
                }
            }
        })


    }
}
