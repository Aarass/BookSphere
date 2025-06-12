import express from "express";
import createHttpError from "http-errors";
import { authenticate } from "../middlewares/authenticate";
import { recommendationService } from "../services/recommendationService";

let router = express.Router();

router.get("/recommendations/me/:userId", authenticate, async (req, res, next) => {
  //let userId = req.session.data.userId!;
  let userId = req.params["userId"];
  try {

    if (!userId) {
      return next(createHttpError(401, `User not authenticated`));
    }
    console.log(`Retrieving recommendations for user: ${userId}`);

    const recommendations = await recommendationService.getRecommendations(userId);
    res.send(recommendations);
  } catch (error) {
    console.error("Recommendation error:", error);
    return next(createHttpError(401, `Failed to retrieve recommendations`));
  }
});

export default router;