import {CollegeProps, RegisterCollege} from '@domain/college/college.types';
import {CollegeOrmEntity} from '@infrastructure/database/college.orm-entity';
import createHttpError from 'http-errors';
import {HttpStatus} from '@lib/http/status-code';
import {ErrorCode} from '@lib/http/error-code';

export interface ICollege {
    registerCollege(props: CollegeProps): RegisterCollege;
    assertAlreadyRegisteredCollege(props: CollegeProps, collegeFromDB: CollegeOrmEntity | null): void;
}

export class College implements ICollege {
    registerCollege(props: CollegeProps) {
        const {name, local} = props;
        return {name, local};
    }
    assertAlreadyRegisteredCollege(props: CollegeProps, collegeFromDB: CollegeOrmEntity | null) {
        if (!collegeFromDB) {
            return;
        }
        if (props.name === collegeFromDB.name) {
            const errorCode = ErrorCode.COLLEGE_NAME_DUPLICATED;
            const errorMessage = `request college is already registered.(request college name:${props.name})`;
            throw createHttpError(HttpStatus.BAD_REQUEST, errorMessage, {errorCode, errorMessage});
        }
    }
}
