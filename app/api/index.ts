import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// TODO
// var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");
// app.use("/", indexRouter);

// ------------------------------------
//  // var router = express.Router();
// // router.get("/", function (req, res, next) {
// //   res.send("respond with a resource");
// // });
// ------------------------------------

// app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send(`Hello, World!`);
});

export default app;
