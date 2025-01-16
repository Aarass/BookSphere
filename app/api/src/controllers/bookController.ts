import express from "express";
import bookService from "../services/bookService";
import createHttpError from "http-errors";
import { authenticate } from "../middlewares/authenticate";
import {
  isValidCreateBookDto,
  isValidCreateCommentDto,
  isValidCreateRatingDto,
  isValidSetReadingStatus,
} from "@interfaces/dtos/bookDto";

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

// TODO
router.get("/books/ranked/:genre", async (req, res, next) => {
  const genre = req.params["genre"];

  try {
    const rankedBooks = await bookService.getRankedBooksByGenre(genre);
    res.status(200).json(rankedBooks);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, "Internal server error"));
  }
});

export default router;
