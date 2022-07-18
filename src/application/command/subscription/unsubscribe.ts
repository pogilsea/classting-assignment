import {IBaseValidator, Validator} from '@lib/http/validator';
import {ISubscription, Subscription} from '@domain/subscription/subscription.entity';
import {ISubscriptionRepository, SubscriptionRepository} from '@domain/subscription/subscription-repository';

export interface IDeleteNewsUseCase {
    run(param: DeleteNewsRequestParam): Promise<void>;
}

export class UnsubscribeCollegeUseCase implements IDeleteNewsUseCase {
    protected subscription: ISubscription;
    protected subscriptionRepository: ISubscriptionRepository;
    protected validator: IBaseValidator;
    constructor() {
        this.subscription = new Subscription();
        this.subscriptionRepository = new SubscriptionRepository();
        this.validator = new Validator();
    }

    run = async (param: DeleteNewsRequestParam) => {
        const {subscriptionId} = param;
        this.validator.execute(RequestParamValidation, param);
        const subscription = await this.subscriptionRepository.readSubscribedCollegeById(subscriptionId);
        this.subscription.assertAlreadyUnsubscribed(subscription);
        const {id} = this.subscription.unsubscribe(subscriptionId);
        await this.subscriptionRepository.unSubscribeCollege(id);
    };
}

export type DeleteNewsRequestParam = {subscriptionId: number};

const RequestParamValidation = {
    type: 'object',
    additionalProperties: false,
    required: ['subscriptionId'],
    properties: {
        subscriptionId: {type: 'number', minimum: 1},
    },
};
