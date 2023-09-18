# 포팅메뉴얼

# 최신가이드
[포팅 매뉴얼 실시간 업데이트](https://www.notion.so/wookdev/ab44cde17ec34f659ef8216d046a9334?pvs=4)

# 1. 배포 메뉴얼

## 1. 사용한 프레임워크 Version, 웹서버 등 설정 값

### 1.stacks

- BackEnd
    - Spring Boot (Java 11)
    - JPA
    - stomp-websocket:2.3.3
- FrontEnd
    - Node(18.X.X) LTS
    - Vite : 4.4.0
    - vite-plugin-pwa : 0.16.4
    - React : 18.2.0
    - Typescript : 5.0.2
    - @formkit/auto-animate : 0.7.0,
    - @stomp/stompjs : 7.0.0,
    - axios : 1.4.0,
    - react-dom : 18.2.0,
    - react-modal : 3.16.1,
    - react-router-dom : 6.14.1,
    - react-slick : 0.29.0,
    - react-textarea-autosize : 8.5.2,
    - slick-carousel : 1.8.1,
    - sockjs-client : 1.6.1,
    - styled-components : 6.0.4,
    - react-tooltip : 5.20.0
    - browser-image-compression : 2.0.2
    - react-swipeable-list : 1.9.1




### 2. Build & Distribute

### Front

1. npm i
2. npm run dev

### Back

1.

### 3.Deployment Command

### 4. Nginx default

- HTTP/2.0

### 5. EC2 Setting

- Docker (24.0.5)
- Nginx

### 6.Files ignored

### Front

- .gitignore

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local
# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local
.env
.env.development
.env.test
.env.production
```

### 9. Setting or Tips…

## 2. 빌드 시 사용되는 환경 변수

### .env.development (개발시)

- VITE_API_BASE_URL : 백엔드 서버주소

### .env.production (배포시)

- VITE_API_BASE_URL : 백엔드 서버주소

## 3. 배포 시 특이사항

## 4. DB 접속 정보 등 주요 계정 정보 및 프로퍼티

### application.properties

```sql
server.port=8080
spring.datasource.username={mysql_유저아이디}
spring.datasource.password={mysql_비밀번호}
spring.jpa.database=mysql
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.use_sql_comments=true
spring.datasource.url={mysql_URL}
spring.mvc.hiddenmethod.filter.enabled=true

jwt.secret-key={jwt 시크릿 키}
oauth.kakao.client-id={kakao 로그인 Auth API키}
oauth.kakao.url.auth=https://kauth.kakao.com
oauth.kakao.url.api=https://kapi.kakao.com
oauth.kakao.url.redirect=https://${neighbrew.url}/kakao/callback

oauth.naver.secret={naver 로그인 secret key ID}
oauth.naver.client-id={naver 로그인 클라이언트 ID}
oauth.naver.url.auth=https://nid.naver.com
oauth.naver.url.api=https://openapi.naver.com
oauth.naver.url.redirect=https://${neighbrew.url}/naver/callback

oauth.google.client-id={google 로그인 클라이언트 ID}
oauth.google.client_secret={google 로그인 secret key ID}
oauth.google.url.auth=https://accounts.google.com/o/oauth2/v2/auth
oauth.google.url.api=https://oauth2.googleapis.com/token
oauth.google.grant_type=authorization_code
oauth.google.url.redirect=https://${neighbrew.url}/google/callback

# AWS S3 upload file size limit
spring.servlet.multipart.max-file-size=15MB
spring.servlet.multipart.max-request-size=15MB

# AWS S3 keys
cloud.aws.credentials.access-key={S3 Access Key}
cloud.aws.credentials.secret-key={S3 Secret Key}

# AWS S3 setting data
cloud.aws.s3.bucket={S3 버킷 이름}
cloud.aws.s3.dir={S3 버킷 최상위 경로}
cloud.aws.region.static=ap-northeast-2
cloud.aws.region.auto=false
cloud.aws.stack.auto=false
# EC2 인스턴스 없이 실행할 경우 에러가 발생하는데 예외를 위한 설정
logging.level.com.amazonaws.util.EC2MetadataUtils=error

# MongoDB
spring.data.mongodb.uri={MongoDB Url}

# Push Move Url
neighbrew.full.url={Neighbrew 도메인, 프로토콜 포함}
```

# 2. 프로젝트에서 사용하는 외부 서비스 정보

### OAuth API(kakao, google, naver) - 키 생성 후 [application.properties](http://application.properties) 등록

- google

[](https://console.cloud.google.com/apis/credentials?hl=ko&project=neighbrew-393203)

- naver

[NAVER Developers](https://developers.naver.com/main/)

- kakao

[Kakao Developers](https://developers.kakao.com/)

### AWS S3 - 개인용 키 생성 후 [application.properties](http://application.properties) 등록

- S3

[클라우드 스토리지 | 웹 스토리지| Amazon Web Services](https://aws.amazon.com/ko/s3/)

### MySQL - DB 및 스키마 생성 후 [application.properties](http://application.properties) 등록

### Mongo DB -  DB 및 스키마 생성 후 [application.properties](http://application.properties) 등록

# 3. DB 덤프 파일(최신본)

[data.zip](https://file.notion.so/f/s/ad492c3f-3b4a-4871-ae14-eb4b0a0b1fa5/Neighbrew_SQL_Dummy.zip?id=a7363922-83aa-4c80-b2c8-44411c861545&table=block&spaceId=1e498673-946a-4533-894f-cdc3f88a756a&expirationTimestamp=1692381600000&signature=aUVcOqOAUccFFlL_OBqJYUM4y78ERPRdTypj3GVA7_c&download=true&downloadName=Neighbrew_SQL_Dummy.zip)