import express from "express";
import { authenticate } from "../middlewares/authenticate";
import userService from "../services/userService";
import createHttpError from "http-errors";

let router = express.Router();

router.get("/users/me", authenticate, async (req, res, next) => {
  let userId = req.session.data.userId!;
  try {
    const user = await userService.getUser(userId);
    res.send(user);
  } catch (err) {
    console.error(err);
    return next(createHttpError(401, `Login failed`));
  }
});

export default router;
