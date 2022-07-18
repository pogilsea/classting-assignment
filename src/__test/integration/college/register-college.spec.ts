import 'module-alias/register';
import chai from 'chai';
import {TestControl} from '@lib/__test/test-control';
import {CollegeTestHelper} from '@__test/helper/college';

chai.should();
const testControl = new TestControl();
const testHelper = new CollegeTestHelper();
describe('[Integration] 학교 정보 추가 API', () => {
    let uri = '/colleges';
    describe('학교 정보 추가 API: SUCCESS', () => {
        let collegeId = 0;
        const name = '클래스팅대학교';
        const local = '캘리포니아';
        it('When: 학교 정보 추가 API 요청 성공시, Then: HTTP Status 200 with OK', async () => {
            const adminToken =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNjU4MTIxMzQ1LCJleHAiOjE2NTk3OTAyNjcxMjV9.FTl7NedCLgKoaOyzh2ExSwFVjaHseRhIKE0j2G_giZc';
            const Authorization = `Bearer ${adminToken}`;
            const param = {name, local};
            const {status, body} = await testControl.request.post(uri, param, {Authorization});
            collegeId = body.result.collegeId;
            chai.assert.equal(status, 200);
        });
        it('When: 학교 정보 추가후 학교 조회 API 호출시,Then: 추가한 학교 정보 값 포함', async () => {
            const {body} = await testControl.request.get(uri);
            let college = body.result.find((item: any) => item.id === collegeId);
            chai.assert.isDefined(college);
            chai.assert.equal(college.name, name);
            chai.assert.equal(college.local, local);
        });
        after('테스트 학교 정보 제거', (done) => {
            testHelper.removeCollege(collegeId);
            done();
        });
    });

    describe('학교 정보 추가 API 호출: ERROR', () => {
        const name = '클래스팅대학교';
        const local = '캘리포니아';
        const adminToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNjU4MTIxMzQ1LCJleHAiOjE2NTk3OTAyNjcxMjV9.FTl7NedCLgKoaOyzh2ExSwFVjaHseRhIKE0j2G_giZc';
        const Authorization = `Bearer ${adminToken}`;
        describe('[UnAuthorized] 인증되지 않은 유저', () => {
            it('When: Authorization 값 없이 학교 정보 추가 API 호출시, Then: HTTP Status 401을 반환', async () => {
                const param = {name, local};
                const {status} = await testControl.request.post(uri, param, {});
                chai.assert.equal(status, 401);
            });
        });
        describe('[Forbidden] 인증되지 않은 Role', () => {
            it('When: 학생 유저 토큰 값으로 학교 정보 추가 API 호출시, Then: HTTP Status 403을 반환', async () => {
                const studentToken =
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6IlVTRVIiLCJpYXQiOjE2NTgxMjEzMDgsImV4cCI6MTY1OTc5MDIyOTgwOX0.KNQ_gwZp2EeVWHOCDyvE1GLEGury2AuuuhmnwzNIE40';
                const Authorization = `Bearer ${studentToken}`;
                const param = {name, local};
                const {status} = await testControl.request.post(uri, param, {Authorization});
                chai.assert.equal(status, 403);
            });
        });
        describe('[Bad Request] 필수값 누락', () => {
            it('When: 학교 이름 필드 누락후 API 호출시, Then: HTTP Status 400을 반환', async () => {
                const param = {local};
                const {status, body} = await testControl.request.post(uri, param, {Authorization});
                const errorMessage = body.error.errorMessage;
                chai.assert.equal(status, 400);
                chai.assert.include(errorMessage, `required`);
                chai.assert.include(errorMessage, `name`);
            });
            it('When: 학교 지역 필드 누락후 API 호출시, Then: HTTP Status 400을 반환', async () => {
                const param = {name};
                const {status, body} = await testControl.request.post(uri, param, {Authorization});
                const errorMessage = body.error.errorMessage;
                chai.assert.equal(status, 400);
                chai.assert.include(errorMessage, `required`);
                chai.assert.include(errorMessage, `local`);
            });
        });
        describe('[Bad Request] 타입 유효성', () => {
            it('When: 학교 이름 number 타입으로 API 호출시, Then: HTTP Status 400을 반환', async () => {
                const param = {name: 1, local};
                const {status, body} = await testControl.request.post(uri, param, {Authorization});
                const errorMessage = body.error.errorMessage;
                chai.assert.equal(status, 400);
                chai.assert.include(errorMessage, `string`);
                chai.assert.include(errorMessage, `name`);
            });
            it('When: 학교 지역 null 타입으로 API 호출시, Then: HTTP Status 400을 반환', async () => {
                const param = {name, local: null};
                const {status, body} = await testControl.request.post(uri, param, {Authorization});
                const errorMessage = body.error.errorMessage;
                chai.assert.equal(status, 400);
                chai.assert.include(errorMessage, `string`);
                chai.assert.include(errorMessage, `local`);
            });
        });
        describe('[Bad Request] 최소 길이 | 최소 값', () => {
            it('When: 학교 이름 빈 값으로 API 호출시, Then: HTTP Status 400을 반환', async () => {
                const param = {name: '', local};
                const {status, body} = await testControl.request.post(uri, param, {Authorization});
                const errorMessage = body.error.errorMessage;
                chai.assert.equal(status, 400);
                chai.assert.include(errorMessage, `NOT have fewer than 1`);
                chai.assert.include(errorMessage, `name`);
            });
            it('When: 학교 지역 빈 값으로 API 호출시, Then: HTTP Status 400을 반환', async () => {
                const param = {name, local: ''};
                const {status, body} = await testControl.request.post(uri, param, {Authorization});
                const errorMessage = body.error.errorMessage;
                chai.assert.equal(status, 400);
                chai.assert.include(errorMessage, `NOT have fewer than 1`);
                chai.assert.include(errorMessage, `local`);
            });
        });
    });
});
