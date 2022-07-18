import {NextFunction, Request, Response} from 'express';
import {BaseRouteHandler} from '@lib/http/base-router';
import {RegisterCollegeUseCase} from '@application/command/college/register-college';
import {QueryColleges} from '@application/queries/college/read-colleges';
import {ROLE} from '@lib/jwt-auth';

export interface ICollegeRouteHandler {
    registerCollege(req: Request, res: Response, next: NextFunction): Promise<any>;
    readColleges(req: Request, res: Response, next: NextFunction): Promise<any>;
}

export class CollegeRouteHandler extends BaseRouteHandler implements ICollegeRouteHandler {
    // 학교 등록
    registerCollege = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = await this.getAuthorizedUser(req);
            this.assertAuthorizedUserRole(token, [ROLE.ADMIN]);
            const body = this.getBody(req);
            const collegeId = await new RegisterCollegeUseCase().run(body);
            // HTTP 응답값 처리
            return res.send({responseCode: 200, resultMessage: 'Success', result: {collegeId}});
        } catch (err) {
            return next(err);
        }
    };
    // 학교 조회
    readColleges = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await new QueryColleges().run();
            return res.send({responseCode: 200, resultMessage: 'Success', result});
        } catch (err) {
            return next(err);
        }
    };
}
