import express from "express";

import bookService from "../services/bookService";
import createHttpError from "http-errors";
import { authenticate } from "../middlewares/authenticate";
import {
  isValidCreateCommentDto,
  isValidCreateRatingDto,
  isValidSetReadingStatus,
} from "@interfaces/dtos/bookDto";

let router = express.Router();

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
  }
);

router.post("/books/:isbn/comments", authenticate, async (req, res, next) => {
  const isbn = req.params["isbn"];
  const userId = req.session.data.userId!;

  const body = req.body;
  if (!isValidCreateCommentDto(body)) {
    return next(createHttpError(400, `Bad request`));
  }

  try {
    const newComment = await bookService.createComment(isbn, userId, body);
    res.status(200).send(newComment);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

router.get("/books/:isbn/comments", async (req, res, next) => {
  const isbn = req.params["isbn"];

  try {
    const comments = await bookService.getComments(isbn);
    res.status(200).send(comments);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

router.put("/books/:isbn/ratings", authenticate, async (req, res, next) => {
  const isbn = req.params["isbn"];
  const userId = req.session.data.userId!;

  const body = req.body;
  if (!isValidCreateRatingDto(body)) {
    return next(createHttpError(400, `Bad request`));
  }

  try {
    await bookService.createRating(isbn, userId, body);
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
    const rating = await bookService.getRating(isbn, userId);
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
