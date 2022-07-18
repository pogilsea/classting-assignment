import {IMySQLBaseRepository, MySQLBaseRepository} from '@lib/database/mysql-base-repository';
import {CollegeSubscriberOrmEntity} from '@infrastructure/database/college-subscriber.orm-entity';
import {CollegeOrmEntity} from '@infrastructure/database/college.orm-entity';

export interface ICollegeRepository extends IMySQLBaseRepository<CollegeOrmEntity> {
    registerCollege(data: Omit<CollegeTableSchema, 'id' | 'createdAt'>): Promise<number>;
    readOneByName(name: string): Promise<CollegeOrmEntity | null>;
    readColleges(): Promise<CollegeOrmEntity[]>;
    readSubscribedColleges(userId: number): Promise<CollegeSubscriberOrmEntity[]>;
}

export class CollegeRepository extends MySQLBaseRepository<CollegeOrmEntity> implements ICollegeRepository {
    constructor() {
        super(CollegeOrmEntity, 'cog');
    }
    async registerCollege(data: Omit<CollegeTableSchema, 'id' | 'createdAt'>) {
        const result = await this.insert(data);
        return result.raw.insertId;
    }
    readOneByName(name: string) {
        return this.getOne({name});
    }

    async readColleges() {
        const orderBy = [{fieldName: 'cog.name', sort: 'ASC' as 'ASC'}];
        return this.get({}, {orderBy});
    }
    async readSubscribedColleges(userId: number) {
        const repo = new MySQLBaseRepository(CollegeSubscriberOrmEntity, 'cs');
        const orderBy = [{fieldName: 'cs.id', sort: 'DESC' as 'DESC'}];
        const leftJoin = [{property: 'cs.college', alias: 'college'}];
        return repo.get({userId}, {orderBy, leftJoin});
    }
}

type CollegeTableSchema = {
    id: number;
    name: string;
    local: string;
    createdAt: string;
};
