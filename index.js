const dotenv = require("dotenv");
dotenv.config(".env");
const Express = require("express");
const app = Express();
const db = require("./db");

const { collage } = require("./controllers");
const { cors } = require("./middlewares");

app.use(Express.json());

app.get("/test", (_, res) => {
  res.json({
    message: "test endpoint successful!",
  });
});

app.get("/", (_, res) => {
  res.json({
    message: "Express on Vercel",
  });
});

app.use(cors);

app.use("/collage", collage);

app.use("/static", Express.static("node_modules"));

db.authenticate()
  .then(() => db.sync())
  // .then(() => db.sync({ force: true }))
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`app is listening on ${process.env.PORT}`);
    });
  })
  .catch((e) => console.log(`error`, e));
