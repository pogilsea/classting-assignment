import 'reflect-metadata';
import {DataSource} from 'typeorm';
import {envNumber, envString} from '@lib/environment';
import {CollegeOrmEntity} from '@infrastructure/database/college.orm-entity';
import {CollegeSubscriberOrmEntity} from '@infrastructure/database/college-subscriber.orm-entity';
import {NewsOrmEntity} from '@infrastructure/database/news.orm-entity';
import {NewsFeedOrmEntity} from '@infrastructure/database/news-feed.orm-entity';

const MysqlConnector = new DataSource({
    type: 'mysql',
    host: envString('MYSQL_HOST'),
    port: envNumber('MYSQL_PORT'),
    username: envString('MYSQL_USER'),
    password: envString('MYSQL_PWD'),
    database: envString('MYSQL_DATABASE_NAME'),
    charset: 'utf8mb4',
    // entities: [__dirname + '/../../**/**/*entity{.ts,.js}'],
    entities: [CollegeOrmEntity, CollegeSubscriberOrmEntity, NewsOrmEntity, NewsFeedOrmEntity],
    multipleStatements: true,
});

export {MysqlConnector};
