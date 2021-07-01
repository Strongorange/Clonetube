17-0 배포, 호환성 코드
이제 우리의 서버를 실제 서버로 올리는 작업을 함
bable-node 는 개발할때만 사용되는 목적으로 사용 => 성능저하가있어서 배포전 일반 JS 코드로 바꿔야 함
=>BABEL CLI 사용
Nodemon 은 파일을 실행하고 그 파일이 모든 것을 실행, Babel 의 경우 모든 폴더를 빌드해서 실행
다 변환된건 좋은데 백엔드 코드를 바꾸는 거니까 client 는 변환하고싶지 않음
build 는 일반 JS 코드임으로 BABEL 없이도 node 가 이해할 수 있음 => start scripts 생성
npm start => regenerator runtime 오류, veiw 폴더가 build 폴더에 없음
