import {NewsFeedOrmEntity} from '@infrastructure/database/news-feed.orm-entity';
import {ISubscriptionRepository, SubscriptionRepository} from '@domain/subscription/subscription-repository';
import {CollegeObjectValue} from '@domain/college/college.types';

export type NewsFeedListItemResponse = Readonly<{
    id: number;
    title: string;
    content: string;
    college: CollegeObjectValue;
    createdAt: string;
}>;
export interface IQueryNewsFeeds {
    run(userId: number): Promise<NewsFeedListItemResponse[]>;
}
export class QueryNewsFeeds implements IQueryNewsFeeds {
    protected repository: ISubscriptionRepository;
    constructor() {
        this.repository = new SubscriptionRepository();
    }

    async run(userId: number) {
        const response = await this.repository.readFeedsByUserId(userId);
        return this.getViewModelList(response);
    }
    getViewModelList = (response: NewsFeedOrmEntity[]): NewsFeedListItemResponse[] => {
        return response.map((item) => {
            const {news, newsId} = item;
            let {college, title, content, createdAt} = news;
            let createdDate = new Date(createdAt).toLocaleString('ko');
            const {name, local} = college;
            return {id: newsId, title, content, createdAt: createdDate, college: {name, local}};
        });
    };
}
