const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "MyRecording.webm"; //앵커의 링크로 이동이 아니라 링크를 다운로드
  document.body.appendChild(a); //앵커가 body에 존재해야 아래서 클릭 가능
  a.click(); //앵커를 클릭한 효과를 줌 => 다운로드 실행
};

const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
  //
  recorder = new MediaRecorder(stream);
  //ondataavailable 이벤트는 레코딩이 끝날을때 실행
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data); // 브라우저의 메모리에 Url 형식으로 비디오 파일을 임시 저장함
    video.srcObject = null; //preview 소스인 stream 을 제거하고 소스를 videoFile 로 업데이트
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);
