import express from "express";
import authorService from "../services/authorService";
import createHttpError from "http-errors";
import { isValidCreateAuthorDto } from "@interfaces/dtos/authorDto";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();

router.post("/authors", authenticate, async (req, res, next) => {
  const body = req.body;
  if (!isValidCreateAuthorDto(body)) {
    return next(createHttpError(400, `Bad request`));
  }

  try {
    const author = await authorService.createAuthor(body);
    res.status(201).send(author);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

router.get("/authors", async (req, res, next) => {
  try {
    const authors = await authorService.getAllAuthors();
    res.status(200).send(authors);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

export default router;
