import 'module-alias/register';
import chai from 'chai';
import {before} from 'mocha';
import {NewsTestHelper} from '@__test/helper/news';
import {RegisterNewsUseCase} from '@application/command/news/register-news';
import {MysqlConnector} from '@lib/database/mysql-connector';
import {QueryNewsByCollegeId} from '@application/queries/subscription/read-news-feed-by-college';

process.env.NODE_ENV = 'debug';
chai.should();
let testHelper = new NewsTestHelper();
let registerNewsUseCase = new RegisterNewsUseCase();

describe('[Application] 대학 뉴스 추가', () => {
    it('unit test initialized', async () => {
        if (!MysqlConnector.isInitialized) {
            await MysqlConnector.initialize();
        }
    });
    describe('대학 뉴스 추가: SUCCESS', () => {
        let collegeId = 0;
        let newsId = 0;
        const title = 'test news title 1';
        const content = 'test news content 1';
        before('대학 신규 추가', async function () {
            collegeId = await testHelper.registerCollege();
        });
        before('대학 뉴스', async function () {
            newsId = await registerNewsUseCase.run({title, content, collegeId});
        });
        it('When: 대학 뉴스 추가후 학교별 소식 조회시, Then: 추가된 뉴스 포함', async () => {
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
