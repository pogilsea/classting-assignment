import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {NewsOrmEntity} from '@infrastructure/database/news.orm-entity';

@Entity('news_feed')
export class NewsFeedOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    newsId: number;

    @Column()
    userId: number;

    @ManyToOne(() => NewsOrmEntity)
    news: NewsOrmEntity;
}
