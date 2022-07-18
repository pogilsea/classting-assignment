import {CollegeRepository, ICollegeRepository} from '@domain/college/college-repository';
import {CollegeOrmEntity} from '@infrastructure/database/college.orm-entity';

export type CollegeListItemResponse = Readonly<{
    id: number;
    name: string;
    local: string;
    createdAt: string;
}>;
export interface IQueryColleges {
    run(): Promise<CollegeListItemResponse[]>;
}
export class QueryColleges implements IQueryColleges {
    protected repository: ICollegeRepository;
    constructor() {
        this.repository = new CollegeRepository();
    }

    async run() {
        const response = await this.repository.readColleges();
        return this.getViewModelList(response);
    }
    getViewModelList = (response: CollegeOrmEntity[]): CollegeListItemResponse[] => {
        return response.map((item) => {
            const {name, local, createdAt, id} = item;
            let createdDate = new Date(createdAt).toLocaleString('ko');
            return {id, createdAt: createdDate, name, local};
        });
    };
}
