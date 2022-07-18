import {NextFunction, Request, Response} from 'express';
import {BaseRouteHandler} from '@lib/http/base-router';
import {DeleteNewsUseCase} from '@application/command/news/delete-news';
import {RegisterNewsUseCase} from '@application/command/news/register-news';
import {EditNewsUseCase} from '@application/command/news/edit-news';
import {ROLE} from '@lib/jwt-auth';

export interface INewsRouterHandler {
    registerNews(req: Request, res: Response, next: NextFunction): Promise<any>;
    editNews(req: Request, res: Response, next: NextFunction): Promise<any>;
    deleteNews(req: Request, res: Response, next: NextFunction): Promise<any>;
}

export class NewsRouteHandler extends BaseRouteHandler implements INewsRouterHandler {
    // 뉴스 등록
    registerNews = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = await this.getAuthorizedUser(req);
            this.assertAuthorizedUserRole(token, [ROLE.ADMIN]);
            const body = this.getBody(req);
            const newsId = await new RegisterNewsUseCase().run(body);
            return res.send({responseCode: 200, resultMessage: 'Success', result: {newsId}});
        } catch (err) {
            return next(err);
        }
    };
    // 뉴스 수정
    editNews = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = await this.getAuthorizedUser(req);
            this.assertAuthorizedUserRole(token, [ROLE.ADMIN]);
            const body = this.getBody(req);
            const newsId = Number(this.getParam(req, 'newsId'));
            await new EditNewsUseCase().run({newsId, ...body});
            return res.send({responseCode: 200, resultMessage: 'Success'});
        } catch (err) {
            return next(err);
        }
    };
    // 뉴스 삭제
    deleteNews = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = await this.getAuthorizedUser(req);
            this.assertAuthorizedUserRole(token, [ROLE.ADMIN]);
            const newsId = Number(this.getParam(req, 'newsId'));
            await new DeleteNewsUseCase().run({newsId});
            return res.send({responseCode: 200, resultMessage: 'Success'});
        } catch (err) {
            return next(err);
        }
    };
}
