import 'reflect-metadata';
import {MySQLBaseRepository} from '@lib/database/mysql-base-repository';
import {CollegeOrmEntity} from '@infrastructure/database/college.orm-entity';

export interface ICollegeTestHelper {
    removeCollege(collegeId: number): Promise<void>;
    readOneById(collegeId: number): Promise<CollegeOrmEntity | null>;
}

export class CollegeTestHelper implements ICollegeTestHelper {
    collegeRepo = new MySQLBaseRepository(CollegeOrmEntity, 'co');
    constructor() {}
    async removeCollege(id: number) {
        await this.collegeRepo.delete({id});
    }
    async readOneById(id: number) {
        return this.collegeRepo.getOne({id});
    }
}
