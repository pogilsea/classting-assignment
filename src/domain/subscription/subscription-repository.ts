import {DeleteResult} from 'typeorm';
import {IMySQLBaseRepository, MySQLBaseRepository} from '@lib/database/mysql-base-repository';
import {NewsFeedOrmEntity} from '@infrastructure/database/news-feed.orm-entity';
import {CollegeSubscriberOrmEntity} from '@infrastructure/database/college-subscriber.orm-entity';
import {NewsOrmEntity} from '@infrastructure/database/news.orm-entity';

export interface ISubscriptionRepository extends IMySQLBaseRepository<CollegeSubscriberOrmEntity> {
    subscribeCollege(data: Omit<SubscriptionTableSchema, 'id' | 'createdAt'>): Promise<number>;
    unSubscribeCollege(id: number): Promise<DeleteResult>;
    readSubscribedCollege(userId: number, collegeId: number): Promise<CollegeSubscriberOrmEntity | null>;
    readFeedsByUserId(userId: number): Promise<NewsFeedOrmEntity[]>;
    readSubscribedCollegeById(subscriptionId: number): Promise<CollegeSubscriberOrmEntity | null>;
    readNewsByCollegeId(userId: number): Promise<NewsOrmEntity[]>;
}

export class SubscriptionRepository extends MySQLBaseRepository<CollegeSubscriberOrmEntity> implements ISubscriptionRepository {
    constructor() {
        super(CollegeSubscriberOrmEntity, 'cs');
    }
    async subscribeCollege(data: Omit<SubscriptionTableSchema, 'id' | 'createdAt'>) {
        const result = await this.insert(data);
        return result.raw.insertId;
    }
    readSubscribedCollege(userId: number, collegeId: number) {
        return this.getOne({userId, collegeId});
    }
    readSubscribedCollegeById(id: number) {
        return this.getOne({id});
    }

    unSubscribeCollege(id: number) {
        return this.delete({id});
    }
    async readFeedsByUserId(userId: number) {
        const repo = new MySQLBaseRepository(NewsFeedOrmEntity, 'nf');
        const orderBy = [{fieldName: 'news.createdAt', sort: 'DESC' as 'DESC'}];
        const leftJoin = [
            {property: 'nf.news', alias: 'news'},
            {property: 'news.college', alias: 'college'},
        ];
        return repo.get({userId}, {orderBy, leftJoin});
    }
    async readNewsByCollegeId(collegeId: number) {
        const repo = new MySQLBaseRepository(NewsOrmEntity, 'news');
        const orderBy = [{fieldName: 'news.createdAt', sort: 'DESC' as 'DESC'}];
        return repo.get({collegeId}, {orderBy});
    }
}

type SubscriptionTableSchema = {
    id: number;
    userId: number;
    collegeId: number;
    createdAt: string;
};
