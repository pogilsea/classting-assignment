import {DeleteResult, UpdateResult} from 'typeorm';
import {NewsOrmEntity} from '@infrastructure/database/news.orm-entity';
import {IMySQLBaseRepository, MySQLBaseRepository} from '@lib/database/mysql-base-repository';
import {NewsFeedOrmEntity} from '@infrastructure/database/news-feed.orm-entity';
import {CollegeSubscriberOrmEntity} from '@infrastructure/database/college-subscriber.orm-entity';

export interface INewsRepository extends IMySQLBaseRepository<NewsOrmEntity> {
    registerNewsAndFeed(data: Omit<NewsTableSchema, 'id' | 'createdAt'>): Promise<number>;
    editNews(keyObject: Partial<NewsTableKey>, param: Partial<NewsTableSchema>): Promise<UpdateResult>;
    deleteNews(keyObject: Partial<NewsTableKey>): Promise<DeleteResult>;
}

export class NewsRepository extends MySQLBaseRepository<NewsOrmEntity> implements INewsRepository {
    collegeRepo;
    constructor() {
        super(NewsOrmEntity, 'news');
        this.collegeRepo = 1;
    }
    async registerNewsAndFeed(data: Omit<NewsTableSchema, 'id' | 'createdAt'>) {
        this.setQueryRunner();
        try {
            await this.startTransaction();
            const news = await this.saveOnTransaction(data, NewsOrmEntity);
            const newsId = news.raw.insertId;
            const subscribers = await this.findOnTransaction({collegeId: data.collegeId}, CollegeSubscriberOrmEntity);
            await Promise.all(subscribers.map(({userId}) => this.saveOnTransaction({userId, newsId}, NewsFeedOrmEntity)));
            await this.commitTransaction();
            return newsId;
        } catch (err) {
            await this.rollbackTransaction();
            throw err;
        }
    }
    editNews(keyObject: Partial<NewsTableKey>, param: Partial<NewsTableSchema>): Promise<any> {
        return this.update(keyObject, param);
    }
    deleteNews(keyObject: Partial<NewsTableKey>) {
        return this.delete(keyObject);
    }
}

type NewsTableSchema = {
    id: number;
    collegeId: number;
    title: string;
    content: string;
    createdAt: string;
};
type NewsTableKey = {
    id: number;
    collegeId: number;
};
