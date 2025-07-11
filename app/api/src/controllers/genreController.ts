import express from "express";
import authorService from "../services/authorService";
import createHttpError from "http-errors";
import { isValidCreateAuthorDto } from "@interfaces/dtos/authorDto";
import { isValidCreateGenreDto } from "@interfaces/dtos/genreDto";
import genreService from "../services/genreService";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();

router.post("/genres", authenticate, async (req, res, next) => {
  const body = req.body;
  if (!isValidCreateGenreDto(body)) {
    return next(createHttpError(400, `Bad request`));
  }

  try {
    const genre = await genreService.createGenre(body);
    res.status(201).send(genre);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

router.get("/genres", async (req, res, next) => {
  try {
    const genres = await genreService.getAllGenres();
    res.status(200).send(genres);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }
});

export default router;
