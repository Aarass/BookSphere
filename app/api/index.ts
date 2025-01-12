import express from "express";
import sessionMiddleware from "./src/middlewares/session";
import corsMiddleware from "./src/middlewares/cors";
import authController from "./src/controllers/auth";
import { authenticate } from "./src/middlewares/authenticate";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(corsMiddleware);
app.use(sessionMiddleware);

app.get("/", authenticate, (req, res) => {
  res.send(`Hello, World!`);
});

app.use("/", authController);

export default app;
