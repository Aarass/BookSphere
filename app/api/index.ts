import express, { Request } from "express";
import corsMiddleware from "./src/middlewares/cors";
import sessionMiddleware from "./src/middlewares/session";
import { authenticate } from "./src/middlewares/authenticate";
import authController from "./src/controllers/authController";
import bookClubController from "./src/controllers/bookClubController";
import userController from "./src/controllers/userController";
import bookController from "./src/controllers/bookController";

import { Server } from "socket.io";
import { createServer } from "http";
import { socketListener } from "./src/controllers/messageController";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(corsMiddleware);
app.use(sessionMiddleware);

io.engine.use(corsMiddleware);
io.engine.use(sessionMiddleware);

io.on("connection", socketListener);

app.use("/", authController);
app.use("/", bookClubController);
app.use("/", userController);
app.use("/", bookController);

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

export default app;

app.get("/", authenticate, (req, res) => {
  res.send(`Hello, World!`);
});
