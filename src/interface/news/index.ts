import {Router} from 'express';
import {INewsRouterHandler, NewsRouteHandler} from '@interface/news/router';

export class NewsRouter {
    newsRouter: INewsRouterHandler;
    router: Router;
    constructor() {
        this.router = Router();
        this.newsRouter = new NewsRouteHandler();
        this.setRouter();
    }
    private setRouter() {
        this.router.post('/news', this.newsRouter.registerNews.bind(this));
        this.router.put('/news/:newsId', this.newsRouter.editNews.bind(this));
        this.router.delete('/news/:newsId', this.newsRouter.deleteNews.bind(this));
        this.router.get('/news', this.newsRouter.deleteNews.bind(this));
    }
}
