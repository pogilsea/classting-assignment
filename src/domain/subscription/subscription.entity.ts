import {SubscribeCollege, SubscriptionProps, UnsubscribeCollege} from '@domain/subscription/subscription.types';
import {CollegeSubscriberOrmEntity} from '@infrastructure/database/college-subscriber.orm-entity';
import createHttpError from 'http-errors';
import {HttpStatus} from '@lib/http/status-code';
import {ErrorCode} from '@lib/http/error-code';

export interface ISubscription {
    subscribe(props: SubscriptionProps): SubscribeCollege;
    unsubscribe(subscriptionId: number): UnsubscribeCollege;
    assertAlreadySubscribed(subscriber: CollegeSubscriberOrmEntity | null): void;
    assertAlreadyUnsubscribed(subscriber: CollegeSubscriberOrmEntity | null): void;
}

export class Subscription implements ISubscription {
    subscribe(props: SubscriptionProps) {
        const {collegeId, userId} = props;
        return {collegeId, userId};
    }

    unsubscribe(subscriptionId: number) {
        return {id: subscriptionId};
    }
    assertAlreadySubscribed(subscriber: CollegeSubscriberOrmEntity | null) {
        if (subscriber) {
            const errorCode = ErrorCode.ALREADY_SUBSCRIBED;
            const errorMessage = `you already subscribed this college.(your request college id:${subscriber.collegeId})`;
            throw createHttpError(HttpStatus.CONFLICT, errorMessage, {errorCode, errorMessage});
        }
    }
    assertAlreadyUnsubscribed(subscriber: CollegeSubscriberOrmEntity | null) {
        if (!subscriber) {
            const errorCode = ErrorCode.ALREADY_UNSUBSCRIBED;
            const errorMessage = `you can't unsubscribe this college. subscribe college first!`;
            throw createHttpError(HttpStatus.CONFLICT, errorMessage, {errorCode, errorMessage});
        }
    }
}
