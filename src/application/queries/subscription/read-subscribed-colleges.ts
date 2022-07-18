import {CollegeObjectValue} from '@domain/college/college.types';
import {CollegeSubscriberOrmEntity} from '@infrastructure/database/college-subscriber.orm-entity';
import {CollegeRepository, ICollegeRepository} from '@domain/college/college-repository';

export type NewsByCollegeListItemResponse = Readonly<{id: number; createdAt: string} & CollegeObjectValue>;
export interface IQuerySubscribedColleges {
    run(userId: number): Promise<any[]>;
}
export class QuerySubscribedColleges implements IQuerySubscribedColleges {
    protected repository: ICollegeRepository;
    constructor() {
        this.repository = new CollegeRepository();
    }

    async run(userId: number) {
        const response = await this.repository.readSubscribedColleges(userId);
        return this.getViewModelList(response);
    }
    getViewModelList = (response: CollegeSubscriberOrmEntity[]): NewsByCollegeListItemResponse[] => {
        return response.map((item) => {
            const {createdAt, id, name, local} = item.college;
            let createdDate = new Date(createdAt).toLocaleString('ko');
            return {id, name, local, createdAt: createdDate};
        });
    };
}
