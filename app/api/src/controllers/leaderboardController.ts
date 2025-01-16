import express from "express";
import createHttpError from "http-errors";
import leaderboardService from "../services/leaderboardService";

const router = express.Router();

router.get("/leaderboards/:criteria/:genre", async (req, res, next) => {
  const criteria = req.params["criteria"];
  const genre = req.params["genre"];

  // TODO remove this one when implemented
  if (genre != "global") {
    return next(createHttpError(501, `Not implemented yet`));
  }

  if (criteria !== "rating" && criteria !== "readers") {
    return next(createHttpError(501, `Not implemented yet`));
  }

  try {
    const books = await leaderboardService.getBooksFromLeaderboard(
      criteria,
      genre,
      req.body
    );
    res.status(200).send(books);
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, `Something went wrong`));
  }

  //
});

export default router;
