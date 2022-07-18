import {Router} from 'express';
import {ISubscriptionRouteHandler, SubscriptionRouteHandler} from '@interface/subscription/router';

export class SubscriptionRouter {
    subscriptionRouter: ISubscriptionRouteHandler;
    router: Router;
    constructor() {
        this.router = Router();
        this.subscriptionRouter = new SubscriptionRouteHandler();
        this.setRouter();
    }
    private setRouter() {
        this.router.post('/subscriptions', this.subscriptionRouter.subscribe.bind(this));
        this.router.delete('/subscriptions/:subscriptionId', this.subscriptionRouter.unsubscribe.bind(this));
        this.router.get('/subscriptions/news-feeds', this.subscriptionRouter.readNewsFeeds.bind(this));
        this.router.get('/subscriptions/colleges', this.subscriptionRouter.readSubscribedColleges.bind(this));
        this.router.get('/subscriptions/colleges/:collegeId/news', this.subscriptionRouter.readNewsByCollege.bind(this));
    }
}
