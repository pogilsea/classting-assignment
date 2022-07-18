## 데이터 베이스 스키마 세팅 방법

**1. create database (MySQL Client)**

```mysql
CREATE DATABASE classting CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**2. create tables (MySQL Client)**

```sql
< database.sql
```

- SQL 스크립트 파일은 script/database.sql 확인

## 데이터 베이스 접근 정보 확인(user, password)

**레포지토리 base 경로에서 .env 파일 확인**

```shell
cat ./.env
```


## 소스코드 실행 방법

**1. install node modules**

```shell
npm install
```

**2. build typescript**

```shell
tsc --watch
```

**3. run application**

```shell
npm run start
```

**3. check jwt for auth**

- 아래의 명령어 실행하여 학생, 학교 관리자용 Bearer 토큰 발급 후, 각 API Authorization 헤더 값 지정
```shell
node ./script/jwt.js
```


## 테스트 코드 실행 방법

**1. start run test code**

```shell
npm run test
```


## API 문서

**아래의 링크 클릭 (Postman)**


Postman URL: https://documenter.getpostman.com/view/7616174/UzQxM4Ed#0199c636-0ec1-4204-a6cd-86afbd0315b1



## 개발 환경

- os: MacOS
- node: 16.15.1
- mysql: 8.0.29
- npm: 8.11.0