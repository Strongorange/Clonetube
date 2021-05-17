import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load(); //브라우저에서 프로그램을 돌리기 때문에 프로세싱 타임이 걸림

  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile)); //FFmpeg 세계에 vidieoFile 을 받아 저장
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4"); //webm => mp4 60프레임 rate (-r) 으로 컨버팅후 ffmpeg 세계에 저장
  await ffmpeg.run(
    "-i",
    "recording.webm",
    "-ss", //seek
    "00:00:01",
    "-frames:v", //스샷 1장
    "1",
    "thumbnail.jpg" //사진 이름 => 모든건 FS 에 저장
  );
  const mp4File = ffmpeg.FS("readFile", "output.mp4"); //FS 파일 시스템 안에있는 위에서 만든 output.mp4 를 저장
  const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg"); // 리턴은 Uint8Array 겁나 많은 숫자들

  const mp4Blob = new Blob([mp4File.buffer], { type: "video.mp4" }); //binary 의 raw data (비디오) 에 접근하려면 buffer 사용
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image.jpg" }); //Blob 은 file-like object

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "MyRecording.mp4"; //앵커의 링크로 이동이 아니라 링크를 다운로드
  document.body.appendChild(a); //앵커가 body에 존재해야 아래서 클릭 가능
  a.click(); //앵커를 클릭한 효과를 줌 => 다운로드 실행

  const thumbA = document.createElement("a");
  thumbA.href = thumbUrl;
  thumbA.download = "MyThumbnail.jpg"; //앵커의 링크로 이동이 아니라 링크를 다운로드
  document.body.appendChild(thumbA); //앵커가 body에 존재해야 아래서 클릭 가능
  thumbA.click(); //앵커를 클릭한 효과를 줌 => 다운로드 실행

  //사용한 파일, URL을 제거
  ffmpeg.FS("unlink", "recording.webm");
  ffmpeg.FS("unlink", "output.mp4");
  ffmpeg.FS("unlink", "thumbnail.jpg");

  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(videoFile);
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
