import {ISubscriptionRepository, SubscriptionRepository} from '@domain/subscription/subscription-repository';
import {NewsObjectValue} from '@domain/news/news.types';
import {NewsOrmEntity} from '@infrastructure/database/news.orm-entity';

export type NewsByCollegeListItemResponse = Readonly<{id: number; createdAt: string} & NewsObjectValue>;
export interface IQueryNewsFeedsByUser {
    run(userId: number): Promise<any[]>;
}
export class QueryNewsByCollegeId implements IQueryNewsFeedsByUser {
    protected repository: ISubscriptionRepository;
    constructor() {
        this.repository = new SubscriptionRepository();
    }

    async run(collegeId: number) {
        const response = await this.repository.readNewsByCollegeId(collegeId);
        return this.getViewModelList(response);
    }
    getViewModelList = (response: NewsOrmEntity[]): NewsByCollegeListItemResponse[] => {
        return response.map((item) => {
            const {id, content, title, createdAt} = item;
            let createdDate = new Date(createdAt).toLocaleString('ko');
            return {id, title, content, createdAt: createdDate};
        });
    };
}
