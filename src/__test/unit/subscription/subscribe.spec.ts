import 'module-alias/register';
import chai from 'chai';
import {before} from 'mocha';
import {SubscribeCollegeUseCase} from '@application/command/subscription/subscribe';
import {SubscriptionTestHelper} from '@__test/helper/subscription';
import {MysqlConnector} from '@lib/database/mysql-connector';
import createHttpError from 'http-errors';
import {QueryNewsFeeds} from '@application/queries/subscription/read-news-feed';
import {RegisterNewsUseCase} from '@application/command/news/register-news';
import {QuerySubscribedColleges} from '@application/queries/subscription/read-subscribed-colleges';

process.env.NODE_ENV = 'debug';
chai.should();
const testHelper = new SubscriptionTestHelper();
const subscribeCollegeUseCase = new SubscribeCollegeUseCase();

describe('[Application] 대학 구독', () => {
    it('unit test initialized', async () => {
        if (!MysqlConnector.isInitialized) {
            await MysqlConnector.initialize();
        }
    });
    describe('대학정보 구독: SUCCESS', () => {
        let collegeId = 0;
        let subscriptionId = 0;
        let userId = 2;

        before('대학정보 신규 추가', async () => {
            collegeId = await testHelper.registerCollege();
        });
        before('대학 구독', async () => {
            const props = {userId, collegeId};
            subscriptionId = await subscribeCollegeUseCase.run(props);
        });

        it('When: 대학 구독 했을 때, Then: 구독한 대학 리스트에 신규로 구독한 대학이 포함된다', async () => {
            const colleges = await new QuerySubscribedColleges().run(userId);
            const college = colleges.find((item) => item.id === collegeId);
            chai.assert.isDefined(college);
        });

        after('테스트 데이터 제거', async () => {
            await testHelper.removeCollege(collegeId);
        });
    });
    describe('대학정보 구독후 뉴스 등록', () => {
        let collegeId = 0;
        let subscriptionId = 0;
        let newsId = 0;
        let userId = 2;
        const title = '대학 뉴스 1';
        const content = '대학 뉴스 내용';
        before('대학정보 추가', async () => {
            collegeId = await testHelper.registerCollege();
        });
        before('대학 구독', async () => {
            const props = {userId, collegeId};
            subscriptionId = await subscribeCollegeUseCase.run(props);
        });
        before('대학 뉴스 추가', async () => {
            newsId = await new RegisterNewsUseCase().run({collegeId, title, content});
        });

        it('When: 구독한 대학에서 뉴스 추가시, Then: 구독한 유저의 피드 리스트에 구독후 추가된 뉴스와 동일한 피드가 노출 된다.', async () => {
            const newsFeeds = await new QueryNewsFeeds().run(userId);
            let newCollegeSubscribed = newsFeeds.find((feed) => feed.id === newsId);
            chai.assert.isDefined(newCollegeSubscribed);
            if (!newCollegeSubscribed) {
                return;
            }
            chai.assert.equal(newCollegeSubscribed.title, title);
            chai.assert.equal(newCollegeSubscribed.content, content);
        });

        after('테스트 데이터 제거', async () => {
            await testHelper.removeCollege(collegeId);
        });
    });
    describe('대학정보 구독: Failed', () => {
        let collegeId = 0;
        let subscriptionId = 0;
        let userId = 2;
        before('대학정보 신규 추가', async () => {
            collegeId = await testHelper.registerCollege();
        });
        before('대학 구독 신청', async () => {
            const props = {userId, collegeId};
            subscriptionId = await subscribeCollegeUseCase.run(props);
        });
        it('When: 이미 구독한 대학을 재구독할 시, Then: Conflict 에러 인스턴스 반환', async () => {
            let error;
            try {
                const props = {userId, collegeId};
                await subscribeCollegeUseCase.run(props);
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
