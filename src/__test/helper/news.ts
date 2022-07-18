import 'reflect-metadata';
import {MySQLBaseRepository} from '@lib/database/mysql-base-repository';
import {NewsOrmEntity} from '@infrastructure/database/news.orm-entity';
import {CollegeOrmEntity} from '@infrastructure/database/college.orm-entity';

export interface INewsTestHelper {
    registerNews(collegeId: number): Promise<number>;
    registerCollege(): Promise<number>;
    removeNews(newsId: number): Promise<void>;
    removeCollege(collegeId: number): Promise<void>;
    readNewsOneById(newsId: number): Promise<NewsOrmEntity | null>;
}

export class NewsTestHelper implements INewsTestHelper {
    newsRepo = new MySQLBaseRepository(NewsOrmEntity, 'news');
    collegeRepo = new MySQLBaseRepository(CollegeOrmEntity, 'co');
    constructor() {}
    async removeCollege(id: number) {
        await this.collegeRepo.delete({id});
    }
    async removeNews(id: number) {
        await this.newsRepo.delete({id});
    }
    async registerNews(collegeId: number) {
        const news = {title: 'test news title1', content: 'test content1', collegeId};
        const result = await this.newsRepo.insert(news);
        return result.raw.insertId;
    }
    async registerCollege(): Promise<number> {
        const college = {name: 'classting college', local: '서울'};
        const result = await this.collegeRepo.insert(college);
        return result.raw.insertId;
    }
    async readNewsOneById(id: number) {
        return this.newsRepo.getOne({id});
    }
}
