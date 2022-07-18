import {IBaseValidator, Validator} from '@lib/http/validator';
import {INewsRepository, NewsRepository} from '@domain/news/news-repository';
import {INews, News} from '@domain/news/news.entity';
import {NewsObjectValue} from '@domain/news/news.types';

export interface IEditNewsUseCase {
    run(param: EditNewsRequestParam): Promise<void>;
}

export class EditNewsUseCase implements IEditNewsUseCase {
    protected news: INews;
    protected repository: INewsRepository;
    protected validator: IBaseValidator;
    constructor() {
        this.news = new News();
        this.repository = new NewsRepository();
        this.validator = new Validator();
    }

    run = async (param: EditNewsRequestParam) => {
        this.validator.execute(RequestParamValidation, param);
        const {id, ...news} = this.news.editNews(param);
        await this.repository.editNews({id}, news);
    };
}

export type EditNewsRequestParam = {newsId: number} & Partial<NewsObjectValue>;

const RequestParamValidation = {
    type: 'object',
    additionalProperties: false,
    required: ['newsId'],
    properties: {
        title: {type: 'string', minLength: 1},
        content: {type: 'string', minLength: 1},
        collegeId: {type: 'number', minimum: 1},
        newsId: {type: 'number', minimum: 1},
    },
};
