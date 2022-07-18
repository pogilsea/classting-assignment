import 'module-alias/register';
import chai from 'chai';
import {TestControl} from '@lib/__test/test-control';
import {CollegeTestHelper} from '@__test/helper/college';

chai.should();
const testControl = new TestControl();
const testHelper = new CollegeTestHelper();
describe('[Integration] 뉴스 수정 API', () => {
    let uri = '/news/';
    describe('뉴스 수정 API: SUCCESS', () => {
        let collegeId = 0;
        let newsId = 0;
        const title = '뉴스 제목 수정 테스트1';
        const content = '뉴스 내용 수정 테스트1';
        const adminToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNjU4MTIxMzQ1LCJleHAiOjE2NTk3OTAyNjcxMjV9.FTl7NedCLgKoaOyzh2ExSwFVjaHseRhIKE0j2G_giZc';
        const Authorization = `Bearer ${adminToken}`;
        before('대학 정보 세팅', async () => {
            const collegeUri = '/colleges';
            const name = '클래스팅대학교';
            const local = '캘리포니아';
            const param = {name, local, collegeId};
            const {body} = await testControl.request.post(collegeUri, param, {Authorization});
            collegeId = body.result.collegeId;
        });
        before('뉴스 정보 세팅', async () => {
            const newsUri = '/news';
            const title = '뉴스 제목 테스트1';
            const content = '뉴스 내용 테스트1';
            const param = {title, content, collegeId};
            const {body} = await testControl.request.post(newsUri, param, {Authorization});
            newsId = body.result.newsId;
        });
        it('When: 뉴스 수정 API 요청 성공시, Then: HTTP Status 200 with OK', async () => {
            const param = {title, content, collegeId};
            const {status} = await testControl.request.put(uri + newsId, param, {Authorization});
            chai.assert.equal(status, 200);
        });
        it('When: 뉴스 수정후 뉴스 조회 API 호출시,Then: 수정한 뉴스 값 일치', async () => {
            let getUri = '/subscriptions/colleges/' + collegeId + '/news';
            const studentToken =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6IlVTRVIiLCJpYXQiOjE2NTgxMjEzMDgsImV4cCI6MTY1OTc5MDIyOTgwOX0.KNQ_gwZp2EeVWHOCDyvE1GLEGury2AuuuhmnwzNIE40';
            const Authorization = `Bearer ${studentToken}`;
            const {body} = await testControl.request.get(getUri, {Authorization});
            let college = body.result.find((item: any) => item.id === newsId);
            chai.assert.isDefined(college);
            chai.assert.equal(college.title, title);
            chai.assert.equal(college.content, content);
        });
        after('테스트 데이터 제거', (done) => {
            testHelper.removeCollege(collegeId);
            done();
        });
    });

    describe('뉴스 수정 API 호출: ERROR', () => {
        let collegeId = 0;
        let newsId = 0;
        before('대학 정보 세팅', async () => {
            const collegeUri = '/colleges';
            const name = '클래스팅대학교';
            const local = '캘리포니아';
            const param = {name, local, collegeId};
            const {body} = await testControl.request.post(collegeUri, param, {Authorization});
            collegeId = body.result.collegeId;
        });
        before('뉴스 정보 세팅', async () => {
            const newsUri = '/news';
            const title = '뉴스 제목 테스트1';
            const content = '뉴스 내용 테스트1';
            const param = {title, content, collegeId};
            const {body} = await testControl.request.post(newsUri, param, {Authorization});
            newsId = body.result.newsId;
        });
        const title = '테스트 수정 제목1';
        const content = '테스트 수정 내용1';
        const adminToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNjU4MTIxMzQ1LCJleHAiOjE2NTk3OTAyNjcxMjV9.FTl7NedCLgKoaOyzh2ExSwFVjaHseRhIKE0j2G_giZc';
        const Authorization = `Bearer ${adminToken}`;
        describe('[UnAuthorized] 인증되지 않은 유저', () => {
            it('When: Authorization 값 없이 뉴스 수정 API 호출시, Then: HTTP Status 401을 반환', async () => {
                const param = {title, content, collegeId};
                const {status} = await testControl.request.put(uri + newsId, param, {});
                chai.assert.equal(status, 401);
            });
        });
        describe('[Forbidden] 인증되지 않은 Role', () => {
            it('When: 학생 유저 토큰 값으로 뉴스 수정 API 호출시, Then: HTTP Status 403을 반환', async () => {
                const studentToken =
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6IlVTRVIiLCJpYXQiOjE2NTgxMjEzMDgsImV4cCI6MTY1OTc5MDIyOTgwOX0.KNQ_gwZp2EeVWHOCDyvE1GLEGury2AuuuhmnwzNIE40';
                const Authorization = `Bearer ${studentToken}`;
                const param = {title, content, collegeId};
                const {status} = await testControl.request.put(uri + newsId, param, {Authorization});
                chai.assert.equal(status, 403);
            });
        });
        describe('[Bad Request] 타입 유효성', () => {
            it('When: 뉴스 제목 number 타입으로 API 호출시, Then: HTTP Status 400을 반환', async () => {
                const param = {title: 1, content, collegeId};
                const {status, body} = await testControl.request.put(uri + newsId, param, {Authorization});
                const errorMessage = body.error.errorMessage;
                chai.assert.equal(status, 400);
                chai.assert.include(errorMessage, `string`);
                chai.assert.include(errorMessage, `title`);
            });
            it('When: 뉴스 내용 null 타입으로 API 호출시, Then: HTTP Status 400을 반환', async () => {
                const param = {title, content: null, collegeId};
                const {status, body} = await testControl.request.put(uri + newsId, param, {Authorization});
                const errorMessage = body.error.errorMessage;
                chai.assert.equal(status, 400);
                chai.assert.include(errorMessage, `string`);
                chai.assert.include(errorMessage, `content`);
            });
            it('When: 대학 아이디 string 타입으로 API 호출시, Then: HTTP Status 400을 반환', async () => {
                const param = {title, content, collegeId: '1'};
                const {status, body} = await testControl.request.put(uri + newsId, param, {Authorization});
                const errorMessage = body.error.errorMessage;
                chai.assert.equal(status, 400);
                chai.assert.include(errorMessage, `number`);
                chai.assert.include(errorMessage, `collegeId`);
            });
        });
        describe('[Bad Request] 최소 길이', () => {
            it('When: 뉴스 제목 빈 값으로 API 호출시, Then: HTTP Status 400을 반환', async () => {
                const param = {title: '', content, collegeId};
                const {status, body} = await testControl.request.put(uri + newsId, param, {Authorization});
                const errorMessage = body.error.errorMessage;
                chai.assert.equal(status, 400);
                chai.assert.include(errorMessage, `NOT have fewer than 1`);
                chai.assert.include(errorMessage, `title`);
            });
            it('When: 뉴스 내용 빈 값으로 API 호출시, Then: HTTP Status 400을 반환', async () => {
                const param = {title, content: '', collegeId};
                const {status, body} = await testControl.request.put(uri + newsId, param, {Authorization});
                const errorMessage = body.error.errorMessage;
                chai.assert.equal(status, 400);
                chai.assert.include(errorMessage, `NOT have fewer than 1`);
                chai.assert.include(errorMessage, `content`);
            });
        });
        after('테스트 뉴스 제거', (done) => {
            testHelper.removeCollege(collegeId);
            done();
        });
    });
});
