import express from "express";
import createHttpError from "http-errors";
import { authenticate } from "../middlewares/authenticate";
import { recommendationService } from "../services/recommendationService";

let router = express.Router();

router.get(
  "/recommendations/me/:type",
  authenticate,
  async (req, res, next) => {
    const userId = req.session.data.userId!;
    const type = req.params["type"];

    try {
      const recommendations = await recommendationService.getRecommendations(
        userId,
        type,
      );
      res.send(recommendations);
    } catch (error) {
      console.error("Recommendation error:", error);
      return next(createHttpError(401, `Failed to retrieve recommendations`));
    }
  },
);

export default router;
