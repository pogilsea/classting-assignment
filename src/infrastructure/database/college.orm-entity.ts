import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {NewsOrmEntity} from '@infrastructure/database/news.orm-entity';
import {CollegeSubscriberOrmEntity} from '@infrastructure/database/college-subscriber.orm-entity';

@Entity('college')
export class CollegeOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    local: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => NewsOrmEntity, (news) => news.college)
    news: NewsOrmEntity[];

    @OneToMany(() => CollegeSubscriberOrmEntity, (news) => news.college)
    subscribers: CollegeSubscriberOrmEntity[];
}
