import express from "express";
import createHttpError from "http-errors";
import { authenticate } from "../middlewares/authenticate";
import { userRecommendationService } from "../services/recommendationService";
import userService from "../services/userService";

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

router.post("/:userId/recommendations", authenticate, async (req, res, next) => {
  const userId = req.params["userId"];
  const { description, bookIsbns } = req.body;

  if (!description || !Array.isArray(bookIsbns) || bookIsbns.length === 0 || bookIsbns.length > 5) {
    return next(createHttpError(400, "Invalid data: description and up to 5 books required"));
  }

  try {
    const list = await userRecommendationService.createList(userId, description, bookIsbns);
    res.status(201).json(list);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, "Something went wrong while creating recommendation list"));
  }
});

router.get("/:userId/recommendations", async (req, res, next) => {
  const userId = req.params["userId"];

  try {
    const listsWithBooks = await userRecommendationService.getListsWithBooks(userId);
    res.status(200).json(listsWithBooks);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, "Something went wrong while retrieving recommendation lists with books"));
  }
});

router.delete("/:userId/recommendations/:listId", authenticate, async (req, res, next) => {
  const userId = req.params["userId"];
  const listId = req.params["listId"];

  try {
    const deleted = await userRecommendationService.deleteList(listId, userId);
    if (!deleted) {
      return next(createHttpError(404, "List not found or does not belong to user"));
    }
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, "Something went wrong while deleting recommendation list"));
  }
});

export default router;
