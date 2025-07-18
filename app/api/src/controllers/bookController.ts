import {
  isValidCreateBookDto,
  isValidCreateCommentDto,
  isValidCreateRatingDto,
  isValidSetReadingStatus,
  isValidUpdateCommentDto,
  isValidUpdateRatingDto,
} from "@interfaces/dtos/bookDto";
import express from "express";
import createHttpError from "http-errors";
import { authenticate } from "../middlewares/authenticate";
import bookService from "../services/bookService";
import commentService from "../services/commentService";
import ratingService from "../services/ratingService";

let router = express.Router();

router.post("/books", async (req, res, next) => {
  const body = req.body;
  if (!isValidCreateBookDto(body)) {
    return next(createHttpError(400, `Bad request`));
  }

  try {
    const book = await bookService.createBook(body);
    res.status(201).send(book);
  } catch (err) {
    {
      const e = err as {
        type: string;
        message: string;
      };
      if (e.type !== undefined && e.type == "customError") {
        return next(createHttpError(500, e.message));
      }
    }

    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

router.get("/books", async (req, res, next) => {
  try {
    let books = await bookService.getAllBooks();
    res.status(200).send(books);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

router.get("/books/:isbn", async (req, res, next) => {
  const isbn = req.params["isbn"];

  try {
    let book = await bookService.getBookByISBN(isbn);
    res.status(200).send(book);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

router.delete("/books/:isbn", async (req, res, next) => {
  const isbn = req.params["isbn"];

  try {
    await bookService.deleteBook(isbn);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

router.get(
  "/books/:isbn/reading-status",
  authenticate,
  async (req, res, next) => {
    const isbn = req.params["isbn"];
    const userId = req.session.data.userId!;

    try {
      const status = await bookService.getReadingStatus(isbn, userId);
      res.status(200).send(status);
    } catch (err) {
      console.error(err);
      return next(createHttpError(500, `Something went wrong`));
    }
  },
);

router.put(
  "/books/:isbn/reading-status",
  authenticate,
  async (req, res, next) => {
    const isbn = req.params["isbn"];
    const userId = req.session.data.userId!;

    const body = req.body;
    if (!isValidSetReadingStatus(body)) {
      return next(createHttpError(400, `Bad request`));
    }

    try {
      await bookService.setReadingStatus(isbn, userId, body);
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      return next(createHttpError(500, `Something went wrong`));
    }
  },
);

router.post("/books/:isbn/comments", authenticate, async (req, res, next) => {
  const isbn = req.params["isbn"];
  const userId = req.session.data.userId!;

  const body = req.body;
  if (!isValidCreateCommentDto(body)) {
    return next(createHttpError(400, `Bad request`));
  }

  try {
    const newComment = await commentService.createComment(isbn, userId, body);
    res.status(200).send(newComment);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

router.put("/books/:isbn/comments/my", authenticate, async (req, res, next) => {
  const isbn = req.params["isbn"];
  const userId = req.session.data.userId!;

  const body = req.body;
  if (!isValidUpdateCommentDto(body)) {
    return next(createHttpError(400, `Bad request`));
  }

  try {
    await commentService.updateComment(isbn, userId, body);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

router.get("/books/:isbn/comments", async (req, res, next) => {
  const isbn = req.params["isbn"];

  try {
    const comments = await commentService.getComments(isbn);
    res.status(200).send(comments);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

router.get("/books/:isbn/comments/my", authenticate, async (req, res, next) => {
  const isbn = req.params["isbn"];
  const userId = req.session.data.userId!;

  try {
    const comment = await commentService.getComment(userId, isbn);
    res.status(200).send(comment);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

router.delete(
  "/books/:isbn/comments/my",
  authenticate,
  async (req, res, next) => {
    const isbn = req.params["isbn"];
    const userId = req.session.data.userId!;

    try {
      const result = await commentService.deleteComment(isbn, userId);
      res.status(200).send(result);
    } catch (err) {
      console.error(err);
      return next(createHttpError(500, `Something went wrong`));
    }
  },
);

router.post("/books/:isbn/ratings", authenticate, async (req, res, next) => {
  const isbn = req.params["isbn"];
  const userId = req.session.data.userId!;

  const body = req.body;
  if (!isValidCreateRatingDto(body)) {
    return next(createHttpError(400, `Bad request`));
  }

  try {
    await ratingService.createRating(isbn, userId, body);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

router.put("/books/:isbn/ratings", authenticate, async (req, res, next) => {
  const isbn = req.params["isbn"];
  const userId = req.session.data.userId!;

  const body = req.body;
  if (!isValidUpdateRatingDto(body)) {
    return next(createHttpError(400, `Bad request`));
  }

  try {
    await ratingService.updateRating(isbn, userId, body);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

router.delete("/books/:isbn/ratings", authenticate, async (req, res, next) => {
  const isbn = req.params["isbn"];
  const userId = req.session.data.userId!;

  try {
    await ratingService.deleteRating(isbn, userId);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

router.get("/books/:isbn/ratings/my", authenticate, async (req, res, next) => {
  const isbn = req.params["isbn"];
  const userId = req.session.data.userId!;

  try {
    const rating = await ratingService.getUserRating(isbn, userId);
    res.status(200).send(rating);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

router.get("/books/:isbn/stats", async (req, res, next) => {
  const isbn = req.params["isbn"];

  try {
    const stats = await bookService.getStats(isbn);
    res.status(200).send(stats);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

export default router;
