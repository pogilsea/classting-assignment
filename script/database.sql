create table classting.college
(
    id        int auto_increment
        primary key,
    name      varchar(32)                        not null,
    local     varchar(16)                        not null,
    createdAt datetime default CURRENT_TIMESTAMP null,
    constraint college_name_uindex
        unique (name)
);

create table classting.college_subscriber
(
    id        int auto_increment
        primary key,
    userId    int                                not null,
    collegeId int                                not null,
    createdAt datetime default CURRENT_TIMESTAMP not null,
    constraint college_subscriber_userId_collegeId_uindex
        unique (userId, collegeId),
    constraint college_subscriber_college_id_fk
        foreign key (collegeId) references classting.college (id)
            on delete cascade
);

create index college_subscriber_userId_index
    on classting.college_subscriber (userId);

create table classting.news
(
    id        int auto_increment
        primary key,
    collegeId int                      null,
    title     varchar(255)             null,
    content   text                     null,
    createdAt datetime default (now()) not null,
    constraint news_college_id_fk
        foreign key (collegeId) references classting.college (id)
            on delete cascade
);

create table classting.news_feed
(
    id     int auto_increment
        primary key,
    userId int not null,
    newsId int not null,
    constraint news_feed_news_id_fk
        foreign key (newsId) references classting.news (id)
            on delete cascade
);

create index news_feed_userId_index
    on classting.news_feed (userId);

