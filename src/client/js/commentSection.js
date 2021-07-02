const { default: fetch } = require("node-fetch");

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const removeBtn = document.querySelector(".video__comment-removebtn");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul"); //video__comment 안의 ul
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  span2.addEventListener("click", handleRemoveComment);
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
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
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }, //backend (express 에게) json 을 보내고있다는 것을 알려줌
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
    textarea.value = "";
  }
};

const handleRemoveComment = async (event) => {
  const videoId = videoContainer.dataset.id;
  //html을 지워
  const comment = event.target.parentNode;
  const commentId = comment.dataset.id;
  console.log(commentId);
  comment.remove();
  const response = await fetch(`/api/videos/${videoId}/removeComment`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId }),
  });
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

if (removeBtn) {
  removeBtn.addEventListener("click", handleRemoveComment);
}
