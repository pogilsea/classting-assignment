import {IBaseValidator, Validator} from '@lib/http/validator';
import {INewsRepository, NewsRepository} from '@domain/news/news-repository';
import {INews, News} from '@domain/news/news.entity';

export interface IDeleteNewsUseCase {
    run(param: DeleteNewsRequestParam): Promise<void>;
}

export class DeleteNewsUseCase implements IDeleteNewsUseCase {
    protected news: INews;
    protected repository: INewsRepository;
    protected validator: IBaseValidator;
    constructor() {
        this.news = new News();
        this.repository = new NewsRepository();
        this.validator = new Validator();
    }

    run = async (param: DeleteNewsRequestParam) => {
        this.validator.execute(RequestParamValidation, param);
        const {id} = this.news.deleteNews(param.newsId);
        await this.repository.deleteNews({id});
    };
}

export type DeleteNewsRequestParam = {newsId: number};

const RequestParamValidation = {
    type: 'object',
    additionalProperties: false,
    required: ['newsId'],
    properties: {
        newsId: {type: 'number', minimum: 1},
    },
};
