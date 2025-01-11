import express from "express";
import neo4j, { query } from "./src/drivers/neo4j";
import redis from "./src/drivers/redis";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

interface User {
  name: string;
}

// Neo4j
//------------------------------------------
(async () => {
  let session = neo4j.session();

  let users = await query<User>(
    session,
    "Match (p:Person) return p.name as name"
  );
  users.forEach((user) => {
    console.log(user);
  });

  await session.close();
})();
//------------------------------------------

//Redis
//------------------------------------------
(async () => {
  let client = await redis.connect();

  await client.set("key", "value");
  let value = await client.get("key");

  console.log(value);

  await client.disconnect();
})();
//------------------------------------------

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
