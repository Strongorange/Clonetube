import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

//Video.find({}, (error, videos) => {});

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "asc" })
    .populate("owner"); //데이터가 들어올때까지 밑으로 진행하지 않고 기다림!!
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  console.log(req.session);
  const id = req.params.id;
  const video = await Video.findById(id).populate("owner").populate("comments");
  console.log("Video Info", video);
  if (req.session.user)
    console.log(typeof req.session.user._id, req.session.user._id);
  console.log(typeof String(video.owner._id), video.owner._id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found." });
  }

  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const id = req.params.id;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video Not Found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const id = req.params.id;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.render("404", { pageTitle: "Video Not Found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the owner of the video");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session; //const _id = req.session.user._id
  const { video, thumb } = req.files; //req.files.path 를 fileUrl 이름으로 저장 ,multer 여러파일 저장하며 files로 수정
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query; //GET 에서 form 으로 보낸 데이터 => url 에 표시 가져오려면 req.query 사용!
  let videos = [];
  if (keyword) {
    //search, keyword가 undefined 가 아닐때 찾는다. search 페이지에 처음 들어오면 keyword 가 undefined 임!
    videos = await Video.find({
      //filter 사용
      title: {
        $regex: new RegExp(keyword, "i"), //keyword가 포함된 것을 찾음, i 는 대소문자 구별 없음!
        //$regex: new RegExp(`^${keyword}`, "i"), // keyword로 시작하는 것을 찾음
        // $regex: new RegExp(`${keyword}$`, "i"), // keyword로 끝나는 것을 찾음
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id); //comment 의 id를 비디오 모델에 저장, 모델의 comment는 object Id
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};

export const removeComment = async (req, res) => {
  const videoId = req.params.id;
  const commentId = req.body.commentId;
  const comment = await Comment.findById(commentId);
  const video = await Video.findById(videoId);
  const videoCommentIndex = await video.comments.indexOf(commentId);
  console.log(video.comments.length);
  if (videoCommentIndex > -1) {
    await video.comments.splice(videoCommentIndex, 1);
    await video.save();
  }
  await comment.deleteOne({ _id: commentId });
  console.log(video.comments.length);
};
