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
