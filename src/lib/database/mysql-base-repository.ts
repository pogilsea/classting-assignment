import 'reflect-metadata';
import {DeleteResult, QueryRunner, SelectQueryBuilder, UpdateResult} from 'typeorm';
import {EntityTarget} from 'typeorm/common/EntityTarget';
import {QueryDeepPartialEntity} from 'typeorm/query-builder/QueryPartialEntity';
import {InsertResult} from 'typeorm/query-builder/result/InsertResult';
import {Brackets} from 'typeorm/query-builder/Brackets';
import {ObjectLiteral} from 'typeorm/common/ObjectLiteral';
import {MysqlConnector} from '@lib/database/mysql-connector';

export interface IMySQLBaseRepository<T> {
    insert(param: QueryDeepPartialEntity<T>): Promise<InsertResult>;
    get(conditions: ConditionType, opt?: GetQueryPropertyType): Promise<T[]>;
    getOne(conditions: ConditionType, opt?: GetQueryPropertyType): Promise<T | null>;
    update(conditions: ConditionType, param: T): Promise<UpdateResult>;
    delete(conditions: ConditionType): Promise<DeleteResult>;
    count(conditions: ConditionType): Promise<number>;
    setEntityTarget(entityTarget: EntityTarget<T>, tableShort?: string): void;
    setQueryRunner(): void;
    startTransaction(): Promise<void>;
    commitTransaction(): Promise<void>;
    rollbackTransaction(): Promise<void>;
    saveOnTransaction<Entity>(data: Entity, entity: EntityTarget<T>): Promise<InsertResult>;
    findOnTransaction<C, Entity>(condition: C, entity: EntityTarget<Entity>): Promise<Entity[]>;
}

export class MySQLBaseRepository<T> implements IMySQLBaseRepository<T> {
    entityTarget: EntityTarget<T>;
    queryRunner: QueryRunner;
    tableShort: string;
    isStartTransaction: boolean;
    dataSource = MysqlConnector;
    constructor(entityTarget: EntityTarget<T>, tableShort: string) {
        if (!this.dataSource.isInitialized) {
            this.dataSource.initialize();
        }
        this.entityTarget = entityTarget;
        this.tableShort = tableShort;
    }

    async insert<Entity>(values: Entity) {
        const query = this.dataSource.createQueryBuilder().insert().into(this.entityTarget).values(values);
        return query.execute();
    }

    update(conditions: ConditionType, param: QueryDeepPartialEntity<T>) {
        return this.dataSource.createQueryBuilder().update(this.entityTarget).set(param).where(conditions).execute();
    }

    delete(conditions: ConditionType): Promise<DeleteResult> {
        const query = this.dataSource.createQueryBuilder().delete().from(this.entityTarget).where(conditions);
        return query.execute();
    }

    get(conditions: ConditionType, opt?: GetQueryPropertyType) {
        const query = this.dataSource.getRepository(this.entityTarget).createQueryBuilder(this.tableShort).where(conditions);
        if (!opt) {
            return query.getMany();
        }
        this.setGetQueryPropertyBuilder(query, opt);
        return query.getMany();
    }

    getOne(conditions: ConditionType, opt?: GetQueryPropertyType) {
        const query = this.dataSource.getRepository(this.entityTarget).createQueryBuilder(this.tableShort).where(conditions);
        if (!opt) {
            return query.getOne();
        }
        this.setGetQueryPropertyBuilder(query, opt);
        return query.getOne();
    }
    count<Key>(conditions: Key): Promise<number> {
        return this.dataSource.createQueryBuilder().select().where(conditions).getCount();
    }
    setEntityTarget(entityTarget: EntityTarget<T>, tableShort?: string) {
        this.entityTarget = entityTarget;
        if (tableShort) {
            this.tableShort = tableShort;
        }
    }
    setQueryRunner() {
        this.queryRunner = this.dataSource.createQueryRunner();
    }
    async startTransaction() {
        if (!this.queryRunner) {
            throw new Error('query runner is not set');
        }
        this.isStartTransaction = true;
        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();
    }
    get isTransactionActive() {
        return !!this.queryRunner && this.queryRunner.isTransactionActive;
    }
    saveOnTransaction<Entity>(data: Entity, entity: EntityTarget<T>) {
        if (!this.isTransactionActive) {
            throw new Error('db transaction is not activated');
        }
        return this.queryRunner.manager.getRepository(entity).insert(data);
    }
    findOnTransaction<C, Target>(condition: C, entity: EntityTarget<Target>) {
        if (!this.isTransactionActive) {
            throw new Error('db transaction is not activated');
        }
        return this.queryRunner.manager.getRepository(entity).findBy(condition);
    }
    async commitTransaction() {
        if (!this.isTransactionActive) {
            throw new Error('db transaction is not activated');
        }
        await this.queryRunner.commitTransaction();
        await this.queryRunner.release();
        this.isStartTransaction = false;
    }
    async rollbackTransaction() {
        if (!this.isTransactionActive) {
            throw new Error('db transaction is not activated');
        }
        await this.queryRunner.rollbackTransaction();
        await this.queryRunner.release();
        this.isStartTransaction = false;
    }
    protected setGetQueryPropertyBuilder = (queryBuilder: SelectQueryBuilder<T>, opt?: GetQueryPropertyType) => {
        if (!opt) {
            return;
        }

        this.setLeftJoinProperty(queryBuilder, opt);
        this.setJoinQuery(queryBuilder, opt);
        this.setFieldsProperty(queryBuilder, opt);
        this.setOrderByProperty(queryBuilder, opt);
        this.setGroupByProperty(queryBuilder, opt);
        this.setLimitProperty(queryBuilder, opt);
    };
    protected setJoinQuery(queryBuilder: SelectQueryBuilder<T>, opt: GetQueryPropertyType) {
        if (!opt.join) {
            return;
        }
        opt.join.forEach((join) => {
            queryBuilder.innerJoinAndSelect(join.property, join.alias);
        });
    }
    protected setLeftJoinProperty(queryBuilder: SelectQueryBuilder<T>, opt: GetQueryPropertyType) {
        if (!opt.leftJoin) {
            return;
        }
        opt.leftJoin.forEach((join) => {
            queryBuilder.leftJoinAndSelect(join.property, join.alias);
        });
    }
    protected setFieldsProperty(queryBuilder: SelectQueryBuilder<T>, opt: GetQueryPropertyType) {
        const {fields} = opt;
        if (!fields) {
            return;
        }
        fields.forEach((field, index) => {
            if (index === 0) {
                queryBuilder.select(fields[0]);
            } else {
                queryBuilder.addSelect(field);
            }
        });
    }
    protected setOrderByProperty(queryBuilder: SelectQueryBuilder<T>, opt: GetQueryPropertyType) {
        const {orderBy} = opt;
        if (!orderBy) {
            return;
        }
        orderBy.forEach((item, index) => {
            if (index === 0) {
                queryBuilder.orderBy(item.fieldName, item.sort);
            } else {
                queryBuilder.addOrderBy(item.fieldName, item.sort);
            }
        });
    }
    protected setGroupByProperty(queryBuilder: SelectQueryBuilder<T>, opt: GetQueryPropertyType) {
        const {groupBy} = opt;
        if (!groupBy) {
            return;
        }
        groupBy.forEach((group, index) => {
            if (index === 0) {
                queryBuilder.groupBy(groupBy[0]);
            } else {
                queryBuilder.addGroupBy(group);
            }
        });
    }

    protected setLimitProperty(queryBuilder: SelectQueryBuilder<T>, opt: GetQueryPropertyType) {
        if (!opt.limit) {
            return;
        }
        if (!opt.offset) {
            opt.offset = 0;
        }
        queryBuilder.limit(opt.limit);
        queryBuilder.offset(opt.offset);
    }
}

export type GetQueryPropertyType = Partial<{
    fields: string[];
    orderBy: {fieldName: string; sort: 'DESC' | 'ASC'}[];
    leftJoin: JoinType[];
    join: JoinType[];
    limit: number | null;
    offset: number | null;
    groupBy: string[];
}>;

export type JoinType = {
    property: string;
    alias: string;
};

export type ConditionType = Brackets | string | ObjectLiteral | ObjectLiteral[];
