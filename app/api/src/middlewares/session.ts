import session from "express-session";
import { RedisStore } from "connect-redis";
import { getClient } from "../drivers/redis";

let redisStore = new RedisStore({
  client: getClient(),
  prefix: "sess_",
});

export default session({
  name: "sessionid",
  store: redisStore,
  resave: false,
  saveUninitialized: false,
  secret: "keyboard cat",
  cookie: {
    secure: false,
    httpOnly: true,
  },
});
