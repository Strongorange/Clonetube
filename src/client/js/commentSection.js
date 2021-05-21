const { default: fetch } = require("node-fetch");

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  newComment.appendChild(icon);
  newComment.appendChild(span);
  videoComments.prepend(newComment); //prepend 는 ELEMENT 를 위에 추가한다! appendChild 는 아래에 추가
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const { status } = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }, //express 에게 json 을 보내고있다는 것을 알려줌
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
  if (status === 201) {
    console.log("create fake comment");
    addComment(text);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
