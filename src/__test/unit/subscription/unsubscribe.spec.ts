import 'module-alias/register';
import chai from 'chai';
import {before} from 'mocha';
import {SubscribeCollegeUseCase} from '@application/command/subscription/subscribe';
import {SubscriptionTestHelper} from '@__test/helper/subscription';
import {RegisterNewsUseCase} from '@application/command/news/register-news';
import {QueryNewsFeeds} from '@application/queries/subscription/read-news-feed';
import {UnsubscribeCollegeUseCase} from '@application/command/subscription/unsubscribe';
import createHttpError from 'http-errors';
import {MysqlConnector} from '@lib/database/mysql-connector';
import {QuerySubscribedColleges} from '@application/queries/subscription/read-subscribed-colleges';

process.env.NODE_ENV = 'debug';
chai.should();
const testHelper = new SubscriptionTestHelper();
const subscribeCollegeUseCase = new SubscribeCollegeUseCase();

describe('[Application] 대학 구독 취소', () => {
    it('unit test initialized', async () => {
        if (!MysqlConnector.isInitialized) {
            await MysqlConnector.initialize();
        }
    });
    let collegeId = 0;
    let subscriptionId = 0;
    let userId = 2;
    describe('대학 구독 취소: SUCCESS', () => {
        before('대학정보 신규 추가', async () => {
            collegeId = await testHelper.registerCollege();
        });
        before('대학교 구독', async () => {
            const props = {userId, collegeId};
            subscriptionId = await subscribeCollegeUseCase.run(props);
        });
        it('When: 대학교 구독 취소, Then: 에러 인스턴스 not defined', async () => {
            let error;
            try {
                await new UnsubscribeCollegeUseCase().run({subscriptionId});
            } catch (err) {
                error = err;
            }
            chai.assert.isUndefined(error);
        });
        it('When: 구독 취소 후 구독 대학 리스트 조회시, Then: 구독 대학 리스트 내 취소한 대학 Undefined', async () => {
            const colleges = await new QuerySubscribedColleges().run(userId);
            const college = colleges.find((item) => item.id === collegeId);
            chai.assert.isUndefined(college);
        });

        after('테스트 데이터 제거', async () => {
            await testHelper.removeCollege(collegeId);
        });
    });
    describe('대학정보 구독 취소 후 뉴스 등록', () => {
        let beforeNewsId = 0;
        let afterNewsId = 0;
        const title = '구독 취소 후 대학 뉴스 1';
        const content = '구독 취소 후 대학 뉴스 내용';
        before('대학정보 추가', async () => {
            collegeId = await testHelper.registerCollege();
        });
        before('대학 구독', async () => {
            const props = {userId, collegeId};
            subscriptionId = await subscribeCollegeUseCase.run(props);
        });
        before('구독중 대학 뉴스 추가', async () => {
            beforeNewsId = await new RegisterNewsUseCase().run({collegeId, title, content});
        });
        before('대학 구독 취소', async () => {
            await new UnsubscribeCollegeUseCase().run({subscriptionId});
        });
        before('구독 취소 후 대학 뉴스 추가', async () => {
            afterNewsId = await new RegisterNewsUseCase().run({collegeId, title, content});
        });

        it('When: 구독 취소후 뉴스 추가 되었을 시, Then: 구독한 유저의 피드 리스트 뉴스 정보가 노출 되지 않음.', async () => {
            const newsFeeds = await new QueryNewsFeeds().run(userId);
            let newCollegeSubscribed = newsFeeds.find((feed) => feed.id === afterNewsId);
            chai.assert.isUndefined(newCollegeSubscribed);
        });

        it('When: 구독 취소전 추가된 뉴스가 있을 시, Then: 구독한 유저의 피드 리스트 뉴스 정보가 노출.', async () => {
            const newsFeeds = await new QueryNewsFeeds().run(userId);
            let newCollegeSubscribed = newsFeeds.find((feed) => feed.id === beforeNewsId);
            chai.assert.isDefined(newCollegeSubscribed);
        });

        after('테스트 데이터 제거', async () => {
            await testHelper.removeCollege(collegeId);
        });
    });

    describe('대학 구독 취소: Failed', () => {
        before('대학정보 신규 추가', async () => {
            collegeId = await testHelper.registerCollege();
        });
        before('대학 구독 신청', async () => {
            const props = {userId, collegeId};
            subscriptionId = await subscribeCollegeUseCase.run(props);
        });
        before('대학 구독 취소', async () => {
            await new UnsubscribeCollegeUseCase().run({subscriptionId});
        });
        it('When: 이미 구독 취소한한 대학을 재취소 할 시, Then: Conflict 에러 인스턴스 반환', async () => {
            let error;
            try {
                await new UnsubscribeCollegeUseCase().run({subscriptionId});
            } catch (err) {
                error = err;
            }
            chai.assert.instanceOf(error, createHttpError.Conflict);
        });
        after('테스트 데이터 제거', async () => {
            await testHelper.removeCollege(collegeId);
        });
    });
});
