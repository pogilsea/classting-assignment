import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {CollegeOrmEntity} from '@infrastructure/database/college.orm-entity';
import {NewsFeedOrmEntity} from '@infrastructure/database/news-feed.orm-entity';

@Entity('news')
export class NewsOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => CollegeOrmEntity, (college) => college.news)
    college: CollegeOrmEntity;

    @Column()
    title: string;

    @Column()
    collegeId: number;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => NewsFeedOrmEntity, (feed) => feed.news)
    feeds: NewsFeedOrmEntity;
}
