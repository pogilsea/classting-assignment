import 'module-alias/register';
import chai from 'chai';
import {EditNewsUseCase} from '@application/command/news/edit-news';
import {NewsTestHelper} from '@__test/helper/news';
import {MysqlConnector} from '@lib/database/mysql-connector';
import {QueryNewsByCollegeId} from '@application/queries/subscription/read-news-feed-by-college';

process.env.NODE_ENV = 'debug';
chai.should();
let testHelper = new NewsTestHelper();
let editNewsUseCase = new EditNewsUseCase();

describe('[Application] 뉴스 정보 수정', () => {
    let collegeId = 0;
    let newsId = 0;
    it('unit test initialized', async () => {
        if (!MysqlConnector.isInitialized) {
            await MysqlConnector.initialize();
        }
    });
    describe('뉴스 정보 수정: SUCCESS', () => {
        const title = 'edit title1';
        const content = 'edit content1';
        before('대학 신규 추가', async function () {
            collegeId = await testHelper.registerCollege();
        });
        before('대학뉴스 신규 추가', async function () {
            newsId = await testHelper.registerNews(collegeId);
        });
        it('When: 대학 뉴스 수정 정상 작동시, Then: 에러 Undefined', async () => {
            let error;
            try {
                await editNewsUseCase.run({newsId, title, content});
            } catch (err) {
                error = err;
            }
            chai.assert.isUndefined(error);
        });
        it('When: 대학정보 수정후 대학별 소식 조회시, Then: 수정된 소식 정보와 일치', async () => {
            const newsList = await new QueryNewsByCollegeId().run(collegeId);
            const news = newsList.find((item) => item.id === newsId);
            chai.assert.isDefined(news);
            if (!news) {
                return;
            }
            chai.assert.equal(news.title, title);
            chai.assert.equal(news.content, content);
        });

        after('테스트 데이터 제거', (done) => {
            testHelper.removeCollege(collegeId);
            done();
        });
    });
});
