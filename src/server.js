import express from "express"; //express 라는 패키지를 "express" 애서 가져옴 nodeJs가 node modules에서 알아서 찾아줌 똑똑이

const PORT = 4000;

const app = express();

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not Allowed</h1>");
  }
  console.log("Allowed, you may continue");
  next();
};

const handleHome = (req, res) => {
  return res.send("<h1>I still love you</h1>");
};

const handleLogin = (req, res) => {
  return res.send("Log in here.");
};

const handleProtected = (req, res) => {
  return res.send("Welcome to the private lounge.");
};

app.use(logger);
app.use(privateMiddleware);

app.get("/protected", handleProtected);
app.get("/", handleHome);
app.get("/login", handleLogin);

const handleListening = () =>
  console.log(`server listening on port http://localhost:${PORT} 💕`);

app.listen(PORT, handleListening);
