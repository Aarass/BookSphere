import { getSession } from "../drivers/neo4j";
import { getClient } from "../drivers/redis";
import { getRatingsCountKey, getRatingsSumKey } from "./statsRepository";

class LeaderboardRepository {
  async getBookIdsFromLeaderboard(
    criteria: "rating" | "readers",
    genre: "global",
    cursor: number | undefined
  ) {
    const lbKey = getLbKey(criteria, genre);
    const redis = getClient();

    try {
      const result = redis.zRangeWithScores(lbKey, cursor ?? "inf", "-inf", {
        REV: true,
        BY: "SCORE",
        LIMIT: {
          offset: 0,
          count: 10,
        },
      });

      return result;
    } finally {
      await redis.quit();
    }
  }

  /**
   * Should be called after someone rated a book
   */
  async updateRatingLeaderboard(isbn: string, genre: "global") {
    const redis = getClient();

    const ratingsCountKey = getRatingsCountKey(isbn);
    const ratingsSumKey = getRatingsSumKey(isbn);

    // Petlja je uklonjena, sa vrlo cvrstom pretpostavkom da
    // ako watch fejla, tj. ako se ratingCount ili ratingSum promeni,
    // mozemo da budemo stigurni da ce se zbog te promene opet doci
    // bas ovde (taj ko je promenio vrednosti pozvace ovu funkciju).
    // Pa ce taj call da postavi novu vrednost, umesto da trenutna
    // linija izvrsenja pokusava vise puta

    // readonly MAX_RETRIES = 3;
    // for (let i = 0; i < this.MAX_RETRIES; i++) {
    try {
      await redis.watch([ratingsCountKey, ratingsSumKey]);

      const [sCount, sSum] = await redis.mGet([ratingsCountKey, ratingsSumKey]);

      if (sCount === null || sSum === null) throw `Internal error`;

      const [count, sum] = [parseInt(sCount), parseInt(sSum)];
      const avg = count === 0 ? 0 : sum / count;

      const lbKey = getLbKey("rating", genre);
      await redis.multi().zAdd(lbKey, { value: isbn, score: avg }).exec();

      // break;
    } catch {}
    // }

    await redis.quit();
  }
}

export const getLbKey = (criteria: "rating" | "readers", genre: "global") =>
  `leaderboard:${genre}:${criteria}`;

export const leaderboardRepository = new LeaderboardRepository();
