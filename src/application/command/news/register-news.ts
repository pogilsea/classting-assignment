import {IBaseValidator, Validator} from '@lib/http/validator';
import {INewsRepository, NewsRepository} from '@domain/news/news-repository';
import {INews, News} from '@domain/news/news.entity';
import {NewsObjectValue} from '@domain/news/news.types';

export interface IRegisterNewsUseCase {
    run(param: RegisterNewsRequestParam): Promise<number>;
}

export class RegisterNewsUseCase implements IRegisterNewsUseCase {
    protected news: INews;
    protected newsRepository: INewsRepository;
    protected validator: IBaseValidator;
    constructor() {
        this.news = new News();
        this.newsRepository = new NewsRepository();
        this.validator = new Validator();
    }

    run = async (param: RegisterNewsRequestParam) => {
        this.validator.execute(RequestParamValidation, param);
        const news = this.news.registerNews(param);
        return this.newsRepository.registerNewsAndFeed(news);
    };
}

export type RegisterNewsRequestParam = {collegeId: number} & NewsObjectValue;

const RequestParamValidation = {
    type: 'object',
    additionalProperties: false,
    required: ['title', 'content', 'collegeId'],
    properties: {
        title: {type: 'string', minLength: 1},
        content: {type: 'string', minLength: 1},
        collegeId: {type: 'number', minimum: 1},
    },
};
