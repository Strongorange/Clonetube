import Video from "../models/Video";

//Video.find({}, (error, videos) => {});

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "asc" }); //데이터가 들어올때까지 밑으로 진행하지 않고 기다림!!
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = async (req, res) => {
  const id = req.params.id;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const id = req.params.id;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video Not Found." });
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const id = req.params.id;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.render("404", { pageTitle: "Video Not Found." });
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
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
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
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
