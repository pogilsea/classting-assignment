import {CollegeRouteHandler, ICollegeRouteHandler} from './router';
import {Router} from 'express';

export class CollegeRouter {
    collegeRouter: ICollegeRouteHandler;
    router: Router;
    constructor() {
        this.router = Router();
        this.collegeRouter = new CollegeRouteHandler();
        this.setRouter();
    }
    private setRouter() {
        this.router.post('/colleges', this.collegeRouter.registerCollege.bind(this));
        this.router.get('/colleges', this.collegeRouter.readColleges.bind(this));
    }
}
