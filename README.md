17-0 배포, 호환성 코드
이제 우리의 서버를 실제 서버로 올리는 작업을 함
bable-node 는 개발할때만 사용되는 목적으로 사용 => 성능저하가있어서 배포전 일반 JS 코드로 바꿔야 함
=>BABEL CLI 사용
Nodemon 은 파일을 실행하고 그 파일이 모든 것을 실행, Babel 의 경우 모든 폴더를 빌드해서 실행
다 변환된건 좋은데 백엔드 코드를 바꾸는 거니까 client 는 변환하고싶지 않음
build 는 일반 JS 코드임으로 BABEL 없이도 node 가 이해할 수 있음 => start scripts 생성
npm start => regenerator runtime 오류, veiw 폴더가 build 폴더에 없음

17-1
regenerator runtime 을 해결하기 위해서 init.js 맨 위에 regenerator runtime 을 임포트해줌
babel 터미널을 종료하고 npm start 를하면 nodeJs 가 우리의 서버를 실행중
홈페이지로 가보면 잘 동작하는데 build의 폴더에는 view 가 없어서 사실 되면 이상함
=> cwd 에서 src/view 에서 골라오기에 src 폴더의 view 에서 템플릿을 꺼내와서 동작중

17-2
webpack 은 development 와 production 두 가지 모드가있음
packpage.json 에서 모드를 전달해주고 dev 모드에서만 watch 를 활성화하기 위해서 webpack 설정에서 mode 와 watch 없앰
assets 를 빌드하고 server 를 빌드하고 npm start 로 서버 실행 => Babel 의 도움 없이도 node 가 코드 이해 가능
build 스크립트에 두 빌드를 묶어줌

17-3 Heroku Deploy
heroku 가 보는 파일은 GitHub 가 보는 파일!!!!!!!!!!!! => Histroy 에 있는 파일들을 본다고 생각하면 됨
=> gitignore 에 있는 파일들을 볼 수 없음
heroku 를 설치후 로그인 => git push heroky master 를 실행하면 heroku 가 배포를 해줌
heroku 는 기본적으로 npm start 를 실행 => Heroku 는 git histroy 를 보기때문에 commit 을 해야 제대로 동작
heroku logs --tail 로 실시간 heroku 모니터링 가능
=> client 를 init 할 수 없다는 에러가 발생 => Heroku 는 Git 이 볼 수 있는 파일을 봄 => DB 의 URL 은 .process.env.DB_URL 을 사용
=> gitignore 에 등륵되어있어 heroku 가 볼 수 없음 => 그렇다고 절대 .env 를 깃에 올리면 안 됨

17-4
MongDBAtlas 에 가입한 후 프로젝트 생성 후 클러스터를 추가
절차를 진행하면 우리의 DB URL 이 생성됨 => 생성된 URL 로 DB 연결 => 파일을 깃에 올리면 안되니 heroku 의 admin panel 사용
heroku 앱 setting 에서 reveal config var 에서 변수를 추가할 수 있음 => DB_URL 변수를 추가
!!!!! username 과 password 를 확실히 하자!!!!!!!!!!!

17-5
Web process failed to bind to $PORT within 60 seconds of launch => Heroku 가 우리 서버의 PORT 와 연결되지 않음
우리는 포트 4000을 설정했는데 Heroku 는 랜덤으로 우리에게 포트를 줌 => 4000으로 연결하지말고 Heroku가 준 Port 로 설정
컴퓨터에서는 4000 Heroku 에서는 변수로 포트를 가지게 설정 => process.env.PORT 에 Heroku 가 준 포트가 설정됨
다 작동되는데 깃허브 로그인에 필요한 GH_CLIENT, GH_SECRET 이 없어서 작동하지 않음 => HEROKU 페이지에서 설정해 줌

17-6
view partials header 에서 소셜 로그인이라면 아바타가 잘 나오게 "/" 을 지워줌 아니라면 사진을 업로드했으니 "/" 을 붙혀줌
로그인하고 atlas 로 가보면 db에 유저가 실제로 생성됨
$ git add .
$ git commit -am "make it better"
$ git push heroku master
해서 heroku deploy

깃허브로 배포하기
깃허브로 하면 master 로 push 하면 바로 배포가 됨

현재는 사진, 동영상들을 HEROKU 서버에 올리기때문에 수정사항이생겨 서버를 다시 배포하면 사진, 동영상들은 없어짐

17-7
위의 문제를 해결하기 위해서 서버에 사진, 동영상을 올리지 않을 것 => 파일을 저장하기위해 AWS 를 사용
AWS S3 에 가입하고 버켓을 만들었음
IAM 으로 가서 사용자를 추가하고 AWS_ID, AWS_SECRET 을 .env 파일에 적어주고 Heroku setting 에 저장
https://www.npmjs.com/package/multer-s3
이제 Multer S3 라는 패키지를 사용해서 s3 에 파일을 업로드 aws-sdk 라는 패키지도 설치해줌
s3 객체를 생성하는데 AWS_ID, AWS_SECRET 을 넘겨줘야함
설정하고 localhost 에서 프로파일 사진을 바꿔봤는데 바뀌지 않고 DB를 확인해보니 avatarUrl 이 사라짐
알고보니 사진이 AWS 서버에 전송됨!

17-8
AWS S3 에서 공개권한 맨 마지막 2개만 체크
multerUploader 에 acl: "public-read" 로 누구나 읽을 수 있게 설정
AWS 에 파일을 올리면 file.path 는 사용되지 않고 file.location 으로 바꿔줘야함 (console로 확인)
videoController 에서도 .path 를 .location 으로 수정해줌
템플릿에 비디오, 사진 소스를 aws 서버에 맞게 수정 "/" 를 삭제해줌
이제 파일들은 AWS 에 존재하고 DB 에는 AWS 파일 URL 경로가 지정되어 템플릿에서 AWS 링크를 소스로 불러와
Heroku 에서 서버를 리빌드해도 파일이 삭제되지 않음!
