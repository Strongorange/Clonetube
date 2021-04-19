import express from "express"; //express 라는 패키지를 "express" 애서 가져옴 nodeJs가 node modules에서 알아서 찾아줌 똑똑이
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

const handleListening = () =>
  console.log(`server listening on port http://localhost:${PORT} 💕`);

app.listen(PORT, handleListening);
