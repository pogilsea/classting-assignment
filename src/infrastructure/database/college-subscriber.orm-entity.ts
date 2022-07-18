import {CollegeOrmEntity} from '@infrastructure/database/college.orm-entity';
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';

@Entity('college_subscriber')
export class CollegeSubscriberOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    collegeId: number;

    @ManyToOne(() => CollegeOrmEntity, (college) => college.news)
    college: CollegeOrmEntity;
}
