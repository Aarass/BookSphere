import express from "express";
import createHttpError from "http-errors";
import { authenticate } from "../middlewares/authenticate";
import { userRecommendationService } from "../services/userRecommendationService";
import userService from "../services/userService";
import bookService from "../services/bookService";

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

router.get("/users/:userId", async (req, res, next) => {
  const userId = req.params["userId"];

  try {
    const user = await userService.getUser(userId);
    res.send(user);
  } catch (err) {
    console.error(err);
    return next(createHttpError(401, `Login failed`));
  }
});

router.get("/users/:userId/books/reading", async (req, res, next) => {
  const userId = req.params["userId"];

  try {
    const books = await bookService.getCurrentlyReadingBooks(userId);
    res.status(200).send(books);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

router.get("/users/:userId/books/completed", async (req, res, next) => {
  const userId = req.params["userId"];

  try {
    const books = await bookService.getCompletedBooks(userId);
    res.status(200).send(books);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

router.post(
  "/users/me/recommendations",
  authenticate,
  async (req, res, next) => {
    let userId = req.session.data.userId!;

    const { description } = req.body;

    if (!description) {
      return next(createHttpError(400, "Invalid data: description required"));
    }

    try {
      const list = await userRecommendationService.createList(
        userId,
        description,
      );
      res.status(201).json(list);
    } catch (err) {
      console.error(err);
      return next(
        createHttpError(
          500,
          "Something went wrong while creating recommendation list",
        ),
      );
    }
  },
);

router.post(
  "/users/me/recommendations/:id/books",
  authenticate,
  async (req, res, next) => {
    const listId = req.params["id"];
    const userId = req.session.data.userId!;

    if (!req.body.isbn || typeof req.body.isbn !== "string") {
      return next(createHttpError(400, "Invalid data"));
    }

    try {
      await userRecommendationService.addToList(userId, listId, req.body);
      res.sendStatus(201);
    } catch (err) {
      return next(createHttpError(500, "Something went wrong"));
    }
  },
);

router.delete(
  "/users/me/recommendations/:id/books",
  authenticate,
  async (req, res, next) => {
    const listId = req.params["id"];
    const userId = req.session.data.userId!;

    if (!req.body.isbn || typeof req.body.isbn !== "string") {
      return next(createHttpError(400, "Invalid data"));
    }

    try {
      await userRecommendationService.removeFromList(userId, listId, req.body);
      res.sendStatus(201);
    } catch (err) {
      return next(createHttpError(500, "Something went wrong"));
    }
  },
);

router.get("/users/:userId/recommendations", async (req, res, next) => {
  const userId = req.params["userId"];

  try {
    const listsWithBooks =
      await userRecommendationService.getListsWithBooks(userId);
    res.status(200).json(listsWithBooks);
  } catch (err) {
    console.error(err);
    return next(
      createHttpError(
        500,
        "Something went wrong while retrieving recommendation lists with books",
      ),
    );
  }
});

router.delete(
  "/users/me/recommendations/:listId",
  authenticate,
  async (req, res, next) => {
    let userId = req.session.data.userId!;

    const listId = req.params["listId"];

    try {
      const deleted = await userRecommendationService.deleteList(
        listId,
        userId,
      );
      if (!deleted) {
        return next(
          createHttpError(404, "List not found or does not belong to user"),
        );
      }
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      return next(
        createHttpError(
          500,
          "Something went wrong while deleting recommendation list",
        ),
      );
    }
  },
);

export default router;
