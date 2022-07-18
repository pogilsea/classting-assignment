import {NextFunction, Request, Response} from 'express';
import {BaseRouteHandler} from '@lib/http/base-router';
import {QueryNewsByCollegeId} from '@application/queries/subscription/read-news-feed-by-college';
import {SubscribeCollegeUseCase} from '@application/command/subscription/subscribe';
import {QueryNewsFeeds} from '@application/queries/subscription/read-news-feed';
import {UnsubscribeCollegeUseCase} from '@application/command/subscription/unsubscribe';
import {QuerySubscribedColleges} from '@application/queries/subscription/read-subscribed-colleges';
import {ROLE} from '@lib/jwt-auth';

export interface ISubscriptionRouteHandler {
    subscribe(req: Request, res: Response, next: NextFunction): Promise<any>;
    unsubscribe(req: Request, res: Response, next: NextFunction): Promise<any>;
    readNewsFeeds(req: Request, res: Response, next: NextFunction): Promise<any>;
    readNewsByCollege(req: Request, res: Response, next: NextFunction): Promise<any>;
    readSubscribedColleges(req: Request, res: Response, next: NextFunction): Promise<any>;
}

export class SubscriptionRouteHandler extends BaseRouteHandler implements ISubscriptionRouteHandler {
    // 뉴스 등록
    subscribe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = await this.getAuthorizedUser(req);
            this.assertAuthorizedUserRole(token, [ROLE.USER]);
            const body = this.getBody(req);
            const subscriptionId = await new SubscribeCollegeUseCase().run({...body, userId: token.id});
            return res.send({responseCode: 200, resultMessage: 'Success', result: {subscriptionId}});
        } catch (err) {
            return next(err);
        }
    };

    // 뉴스 삭제
    unsubscribe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = await this.getAuthorizedUser(req);
            this.assertAuthorizedUserRole(token, [ROLE.USER]);
            const subscriptionId = Number(this.getParam(req, 'subscriptionId'));
            await new UnsubscribeCollegeUseCase().run({subscriptionId});
            return res.send({responseCode: 200, resultMessage: 'Success'});
        } catch (err) {
            return next(err);
        }
    };

    // 뉴스피드 조회
    readNewsFeeds = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = await this.getAuthorizedUser(req);
            this.assertAuthorizedUserRole(token, [ROLE.USER]);
            const result = await new QueryNewsFeeds().run(token.id);
            return res.send({responseCode: 200, resultMessage: 'Success', result});
        } catch (err) {
            return next(err);
        }
    };
    // 학교별 뉴스 조회
    readNewsByCollege = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = await this.getAuthorizedUser(req);
            this.assertAuthorizedUserRole(token, [ROLE.USER]);
            const collegeId = Number(this.getParam(req, 'collegeId'));
            const result = await new QueryNewsByCollegeId().run(collegeId);
            return res.send({responseCode: 200, resultMessage: 'Success', result});
        } catch (err) {
            return next(err);
        }
    };
    // 구독중인 학교 조회
    readSubscribedColleges = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = await this.getAuthorizedUser(req);
            this.assertAuthorizedUserRole(token, [ROLE.USER]);
            const result = await new QuerySubscribedColleges().run(token.id);
            return res.send({responseCode: 200, resultMessage: 'Success', result});
        } catch (err) {
            return next(err);
        }
    };
}
