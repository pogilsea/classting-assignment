export type SubscribeCollege = {id?: number; collegeId: number; userId: number};
export type UnsubscribeCollege = {id: number};

export type SubscriptionProps = {
    userId: number;
    collegeId: number;
};
