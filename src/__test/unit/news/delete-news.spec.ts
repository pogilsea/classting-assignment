import 'reflect-metadata';
import 'module-alias/register';
import chai from 'chai';
import {DeleteNewsUseCase} from '@application/command/news/delete-news';
import {NewsTestHelper} from '@__test/helper/news';
import {MysqlConnector} from '@lib/database/mysql-connector';
import {QueryNewsByCollegeId} from '@application/queries/subscription/read-news-feed-by-college';

process.env.NODE_ENV = 'debug';
chai.should();
const testHelper = new NewsTestHelper();
const deleteNewsUseCase = new DeleteNewsUseCase();

describe('[Application] 대학 뉴스 삭제', () => {
    let collegeId = 0;
    let newsId = 0;
    it('unit test initialized', async () => {
        if (!MysqlConnector.isInitialized) {
            await MysqlConnector.initialize();
        }
    });
    describe('대학 뉴스 삭제: SUCCESS', () => {
        before('대학 신규 추가', async () => {
            collegeId = await testHelper.registerCollege();
        });
        before('대학뉴스 신규 추가', async () => {
            newsId = await testHelper.registerNews(collegeId);
        });
        it('When: 대학 뉴스 삭제 정상 작동시, Then: 에러 Undefined', async () => {
            let error;
            try {
                await deleteNewsUseCase.run({newsId});
            } catch (err) {
                error = err;
            }
            chai.assert.isUndefined(error);
        });
        it('When: 삭제 후 학교별 소식 조회시, Then: 리스트 내 Undefined 반환', async () => {
            const newsList = await new QueryNewsByCollegeId().run(collegeId);
            const news = newsList.find((item) => item.id === newsId);
            chai.assert.isUndefined(news);
        });
        //
        after('테스트 데이터 제거', (done) => {
            testHelper.removeCollege(collegeId);
            done();
        });
    });
});
