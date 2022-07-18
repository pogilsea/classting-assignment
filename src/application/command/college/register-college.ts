import {IBaseValidator, Validator} from '@lib/http/validator';
import {College, ICollege} from '@domain/college/college.entity';
import {CollegeRepository, ICollegeRepository} from '@domain/college/college-repository';
import {CollegeObjectValue} from '@domain/college/college.types';

export interface IRegisterCollegeUseCase {
    run(param: RegisterCollegeRequestParam): Promise<number>;
}

export class RegisterCollegeUseCase implements IRegisterCollegeUseCase {
    protected college: ICollege;
    protected collegeRepository: ICollegeRepository;
    protected validator: IBaseValidator;
    constructor() {
        this.college = new College();
        this.collegeRepository = new CollegeRepository();
        this.validator = new Validator();
    }

    run = async (param: RegisterCollegeRequestParam) => {
        this.validator.execute(RequestParamValidation, param);
        const collegeFromDB = await this.collegeRepository.readOneByName(param.name);
        const college = this.college.registerCollege(param);
        this.college.assertAlreadyRegisteredCollege(param, collegeFromDB);
        return this.collegeRepository.registerCollege(college);
    };
}

export type RegisterCollegeRequestParam = CollegeObjectValue;

const RequestParamValidation = {
    type: 'object',
    additionalProperties: false,
    required: ['name', 'local'],
    properties: {
        name: {type: 'string', minLength: 1},
        local: {type: 'string', minLength: 1},
    },
};
