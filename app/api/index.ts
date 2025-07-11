import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import authController from "./src/controllers/authController";
import authorController from "./src/controllers/authorController";
import bookClubController from "./src/controllers/bookClubController";
import bookController from "./src/controllers/bookController";
import genreController from "./src/controllers/genreController";
import leaderboardController from "./src/controllers/leaderboardController";
import { socketListener } from "./src/controllers/messageController";
import recommendationController from "./src/controllers/recommendationController";
import userController from "./src/controllers/userController";
import { connectToDatabase } from "./src/drivers/mongo";
import { authenticate } from "./src/middlewares/authenticate";
import corsMiddleware from "./src/middlewares/cors";
import sessionMiddleware from "./src/middlewares/session";

const app = express();
const server = createServer(app);
const io = new Server(server);

async function startApplication() {
  try {
    await connectToDatabase();

    console.log("Aplikacija je pokrenuta");
  } catch (error) {
    console.error("Greška pri pokretanju aplikacije:", error);
    process.exit(1);
  }
}
startApplication();
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
app.use("/", authorController);
app.use("/", genreController);
app.use("/", leaderboardController);
app.use("/", recommendationController);

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

export default app;

app.get("/", authenticate, (req, res) => {
  res.send(`Hello, World!`);
});
