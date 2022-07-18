import {IBaseValidator, Validator} from '@lib/http/validator';
import {ISubscription, Subscription} from '@domain/subscription/subscription.entity';
import {ISubscriptionRepository, SubscriptionRepository} from '@domain/subscription/subscription-repository';

export interface IRegisterNewsUseCase {
    run(param: SubscribeRequestParam): Promise<number>;
}

export class SubscribeCollegeUseCase implements IRegisterNewsUseCase {
    protected subscription: ISubscription;
    protected subscriptionRepository: ISubscriptionRepository;
    protected validator: IBaseValidator;
    constructor() {
        this.subscription = new Subscription();
        this.subscriptionRepository = new SubscriptionRepository();
        this.validator = new Validator();
    }

    run = async (param: SubscribeRequestParam) => {
        const {userId, collegeId} = param;
        this.validator.execute(RequestParamValidation, param);
        const subscriber = await this.subscriptionRepository.readSubscribedCollege(userId, collegeId);
        this.subscription.assertAlreadySubscribed(subscriber);
        const subscribe = this.subscription.subscribe(param);
        return this.subscriptionRepository.subscribeCollege(subscribe);
    };
}

export type SubscribeRequestParam = {collegeId: number; userId: number};

const RequestParamValidation = {
    type: 'object',
    additionalProperties: false,
    required: ['userId', 'collegeId'],
    properties: {
        userId: {type: 'number', minimum: 1},
        collegeId: {type: 'number', minimum: 1},
    },
};
