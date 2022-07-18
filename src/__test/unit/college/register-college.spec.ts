import 'reflect-metadata';
import 'module-alias/register';
import chai from 'chai';
import {before} from 'mocha';
import {RegisterCollegeUseCase} from '@application/command/college/register-college';
import {CollegeTestHelper} from '@__test/helper/college';
import createHttpError from 'http-errors';
import {MysqlConnector} from '@lib/database/mysql-connector';
import {QueryColleges} from '@application/queries/college/read-colleges';

process.env.NODE_ENV = 'debug';
chai.should();
const testHelper = new CollegeTestHelper();
const registerCollegeUseCase = new RegisterCollegeUseCase();

describe('[Application] 대학정보 신규 추가', () => {
    it('unit test initialized', async () => {
        if (!MysqlConnector.isInitialized) {
            await MysqlConnector.initialize();
        }
    });
    describe('대학정보 신규 추가: SUCCESS', () => {
        let collegeId = 0;
        const name = '클래스팅대';
        const local = '서울';
        it('When: 대학정보 신규 추가시, Then: 대학 아이디 값 숫자 타입 반환', async () => {
            const props = {name, local};
            collegeId = await registerCollegeUseCase.run(props);
            chai.assert.isNumber(collegeId);
        });
        it('When: 대학정보 추가후 대학리스트 호출시, Then: 대학리스트 내 포함되어야 한다.', async () => {
            const colleges = await new QueryColleges().run();
            const college = colleges.find((item) => item.id === collegeId);
            chai.assert.isDefined(college);
            if (!college) {
                return;
            }
            chai.assert.equal(college.name, name);
            chai.assert.equal(college.local, local);
        });

        after('테스트 데이터 제거', (done) => {
            testHelper.removeCollege(collegeId);
            done();
        });
    });
    describe('대학정보 신규 추가: ERROR', () => {
        let collegeId = 0;
        const name = '클래스팅대학교';
        const local = '서울';
        before('대학정보 신규 추가', async () => {
            const props = {name, local};
            collegeId = await registerCollegeUseCase.run(props);
        });
        it('When: 동일한 대학교 이름 추가시, Then: Bad Request 에러 throw', async () => {
            let error;
            try {
                const props = {name, local};
                await registerCollegeUseCase.run(props);
            } catch (err) {
                error = err;
            }
            chai.assert.instanceOf(error, createHttpError.BadRequest);
        });

        after('테스트 데이터 제거', (done) => {
            testHelper.removeCollege(collegeId);
            done();
        });
    });
});
