import 'module-alias/register';
import chai from 'chai';
import {TestControl} from '@lib/__test/test-control';
import {NewsTestHelper} from '@__test/helper/news';
import {MysqlConnector} from '@lib/database/mysql-connector';

chai.should();
const testControl = new TestControl();
const testHelper = new NewsTestHelper();
describe('[Integration] 구독 API', () => {
    let uri = '/subscriptions';
    it('should ', function () {
        MysqlConnector.initialize();
    });
    describe('구독 API: SUCCESS', () => {
        let collegeId = 0;
        let subscriptionId = 0;
        let newsId = 0;
        const title = '구독 제목 테스트1';
        const content = '구독 내용 테스트1';
        const userToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6IlVTRVIiLCJpYXQiOjE2NTgxMjEzMDgsImV4cCI6MTY1OTc5MDIyOTgwOX0.KNQ_gwZp2EeVWHOCDyvE1GLEGury2AuuuhmnwzNIE40';
        const Authorization = `Bearer ${userToken}`;
        before('대학 정보 세팅', async () => {
            const adminToken =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNjU4MTIxMzQ1LCJleHAiOjE2NTk3OTAyNjcxMjV9.FTl7NedCLgKoaOyzh2ExSwFVjaHseRhIKE0j2G_giZc';
            const Authorization = `Bearer ${adminToken}`;
            const collegeUri = '/colleges';
            const name = '클래스팅대학교';
            const local = '캘리포니아';
            const param = {name, local, collegeId};
            const {body} = await testControl.request.post(collegeUri, param, {Authorization});
            collegeId = body.result.collegeId;
        });
        describe('Case: 구독 신청', () => {
            before('구독 세팅', async () => {
                const param = {collegeId};
                const {body} = await testControl.request.post(uri, param, {Authorization});
                subscriptionId = body.result.subscriptionId;
            });
            it('When: 구독 신청 후 구독중인 학교 조회 API 호출시, Then: 추가한 대학교 포함', async () => {
                let getUri = '/subscriptions/colleges';
                const {body} = await testControl.request.get(getUri, {Authorization});
                let college = body.result.find((item: any) => item.id === collegeId);
                chai.assert.isDefined(college);
            });
        });
        describe('Case: 뉴스 정보 있는 대학 구독', () => {
            before('뉴스 정보 세팅', async () => {
                const adminToken =
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNjU4MTIxMzQ1LCJleHAiOjE2NTk3OTAyNjcxMjV9.FTl7NedCLgKoaOyzh2ExSwFVjaHseRhIKE0j2G_giZc';
                const Authorization = `Bearer ${adminToken}`;
                const newsUri = '/news';
                const param = {title, content, collegeId};
                const {body} = await testControl.request.post(newsUri, param, {Authorization});
                newsId = body.result.newsId;
            });
            before('구독 세팅', async () => {
                const param = {collegeId};
                const {body} = await testControl.request.post(uri, param, {Authorization});
                subscriptionId = body.result.subscriptionId;
            });
            it('When: 구독 신청 후 뉴스 조회 API 호출시,Then: 신청 한 뉴스 포함', async () => {
                let getUri = '/subscriptions/colleges/' + collegeId + '/news';
                const {body} = await testControl.request.get(getUri, {Authorization});
                let news = body.result.find((item: any) => item.id === newsId);
                chai.assert.isDefined(news);
                chai.assert.equal(news.title, title);
                chai.assert.equal(news.content, content);
            });
            it('When: 뉴스피드 조회 API 호출시, Then: 이전 추가된 뉴스 피드 미포함', async () => {
                let getUri = '/subscriptions/news-feeds';
                const {body} = await testControl.request.get(getUri, {Authorization});
                let newsFeed = body.result.find((item: any) => item.id === newsId);
                chai.assert.isUndefined(newsFeed);
            });
            after('테스트 데이터 제거', (done) => {
                testHelper.removeNews(newsId);
                done();
            });
        });
        describe('Case: 대학 구독 후 뉴스 추가', () => {
            before('구독 세팅', async () => {
                const param = {collegeId};
                const {body} = await testControl.request.post(uri, param, {Authorization});
                subscriptionId = body.result.subscriptionId;
            });
            before('뉴스 정보 세팅', async () => {
                const adminToken =
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNjU4MTIxMzQ1LCJleHAiOjE2NTk3OTAyNjcxMjV9.FTl7NedCLgKoaOyzh2ExSwFVjaHseRhIKE0j2G_giZc';
                const Authorization = `Bearer ${adminToken}`;
                const newsUri = '/news';
                const param = {title, content, collegeId};
                const {body} = await testControl.request.post(newsUri, param, {Authorization});
                newsId = body.result.newsId;
            });
            it('When: 뉴스피드 조회 API 호출시,Then: 추가한 뉴스 피드 포함', async () => {
                let getUri = '/subscriptions/news-feeds';
                const {body} = await testControl.request.get(getUri, {Authorization});
                let newsFeed = body.result.find((item: any) => item.id === newsId);
                chai.assert.isDefined(newsFeed);
                chai.assert.equal(newsFeed.title, title);
                chai.assert.equal(newsFeed.content, content);
            });
            after('테스트 데이터 제거', (done) => {
                testHelper.removeNews(newsId);
                done();
            });
        });
        afterEach('테스트 데이터 제거', (done) => {
            testControl.request.delete(uri + '/' + subscriptionId, {Authorization});
            done();
        });
        after('테스트 데이터 제거', (done) => {
            testHelper.removeCollege(collegeId);
            done();
        });
    });

    describe('구독 추가 API 호출: ERROR', () => {
        let collegeId = 0;
        const studentToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6IlVTRVIiLCJpYXQiOjE2NTgxMjEzMDgsImV4cCI6MTY1OTc5MDIyOTgwOX0.KNQ_gwZp2EeVWHOCDyvE1GLEGury2AuuuhmnwzNIE40';
        const Authorization = `Bearer ${studentToken}`;
        describe('[UnAuthorized] 인증되지 않은 유저', () => {
            it('When: Authorization 값 없이 구독 API 호출시, Then: HTTP Status 401을 반환', async () => {
                const param = {collegeId};
                const {status} = await testControl.request.post(uri, param, {});
                chai.assert.equal(status, 401);
            });
        });
        describe('[Forbidden] 인증되지 않은 Role', () => {
            it('When: 어드민 유저 토큰 값으로 구독 API 호출시, Then: HTTP Status 403을 반환', async () => {
                const adminToken =
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNjU4MTIxMzQ1LCJleHAiOjE2NTk3OTAyNjcxMjV9.FTl7NedCLgKoaOyzh2ExSwFVjaHseRhIKE0j2G_giZc';
                const Authorization = `Bearer ${adminToken}`;
                const param = {collegeId};
                const {status} = await testControl.request.post(uri, param, {Authorization});
                chai.assert.equal(status, 403);
            });
        });
        describe('[Bad Request] 필수값 누락', () => {
            it('When: 구독 학교 아이디 누락후 API 호출시, Then: HTTP Status 400을 반환', async () => {
                const param = {};
                const {status, body} = await testControl.request.post(uri, param, {Authorization});
                const errorMessage = body.error.errorMessage;
                chai.assert.equal(status, 400);
                chai.assert.include(errorMessage, `required`);
                chai.assert.include(errorMessage, `collegeId`);
            });
        });
        describe('[Bad Request] 타입 유효성', () => {
            it('When: 구독 학교 아이디 string 타입으로 API 호출시, Then: HTTP Status 400을 반환', async () => {
                const param = {collegeId: '1'};
                const {status, body} = await testControl.request.post(uri, param, {Authorization});
                const errorMessage = body.error.errorMessage;
                chai.assert.equal(status, 400);
                chai.assert.include(errorMessage, `number`);
                chai.assert.include(errorMessage, `collegeId`);
            });
        });

        after('테스트 구독 제거', (done) => {
            testHelper.removeCollege(collegeId);
            done();
        });
    });
});
