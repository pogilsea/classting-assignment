import {MySQLBaseRepository} from '@lib/database/mysql-base-repository';
import {CollegeSubscriberOrmEntity} from '@infrastructure/database/college-subscriber.orm-entity';
import {CollegeOrmEntity} from '@infrastructure/database/college.orm-entity';
import {NewsOrmEntity} from '@infrastructure/database/news.orm-entity';

export interface ISubscriptionTestHelper {
    registerCollege(): Promise<void>;
    registerNews(collegeId: number, title: string, content: string): Promise<void>;
    unSubscribeCollege(collegeId: number): Promise<void>;
    removeCollege(collegeId: number): Promise<void>;
    removeNews(newsId: number): Promise<void>;
    readOneById(subscriptionId: number): Promise<CollegeSubscriberOrmEntity | null>;
    readCollegeOne(collegeId: number): Promise<CollegeOrmEntity | null>;
}

export class SubscriptionTestHelper implements ISubscriptionTestHelper {
    collegeRepo = new MySQLBaseRepository(CollegeOrmEntity, 'co');
    subscriptionRepo = new MySQLBaseRepository(CollegeSubscriberOrmEntity, 'co');
    newsRepo = new MySQLBaseRepository(NewsOrmEntity, 'co');

    async unSubscribeCollege(id: number) {
        await this.subscriptionRepo.delete({id});
    }
    async removeCollege(id: number) {
        await this.collegeRepo.delete({id});
    }
    readCollegeOne(id: number) {
        return this.collegeRepo.getOne({id});
    }
    async removeNews(id: number) {
        await this.newsRepo.delete({id});
    }
    async registerCollege() {
        const name = '클래스팅대학교';
        const local = '서울';
        const college = await this.collegeRepo.getOne({name});
        if (college) {
            return college.id;
        }
        const response = await this.collegeRepo.insert({name, local});
        return response.raw.insertId;
    }
    async registerNews(collegeId: number, title: string, content: string) {
        const response = await this.newsRepo.insert({collegeId, title, content});
        return response.raw.insertId;
    }
    async readOneById(id: number) {
        return this.subscriptionRepo.getOne({id});
    }
}
