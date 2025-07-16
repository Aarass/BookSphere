import { Book } from "@interfaces/book";
import { getSession } from "../drivers/neo4j";
import { getClient } from "../drivers/redis";
import { getRatingsCountKey, getRatingsSumKey } from "./statsRepository";

class LeaderboardRepository {
  async onBookCreated(book: Book) {
    let redis;
    try {
      redis = getClient();
      const multi = redis.multi();

      for (const genre of book.genres) {
        multi.zAdd(getLbKey("rating", genre.id), {
          score: 0,
          value: book.isbn,
        });
        multi.zAdd(getLbKey("readers", genre.id), {
          score: 0,
          value: book.isbn,
        });
      }

      multi.zAdd(getLbKey("rating", "global"), {
        score: 0,
        value: book.isbn,
      });
      multi.zAdd(getLbKey("readers", "global"), {
        score: 0,
        value: book.isbn,
      });

      await multi.execAsPipeline();
    } finally {
      redis?.quit();
    }
  }

  async onBookDeleted(book: Book) {
    let redis;
    try {
      redis = getClient();
      const multi = redis.multi();

      for (const genre of book.genres) {
        multi.zRem(getLbKey("rating", genre.id), book.isbn);
        multi.zRem(getLbKey("readers", genre.id), book.isbn);
      }
      multi.zRem(getLbKey("rating", "global"), book.isbn);
      multi.zRem(getLbKey("readers", "global"), book.isbn);

      await multi.execAsPipeline();
    } finally {
      redis?.quit();
    }
  }

  async getBookIdsFromLeaderboard(
    criteria: "rating" | "readers",
    genre: string,
    cursor: number | undefined,
  ) {
    const lbKey = getLbKey(criteria, genre);
    const redis = getClient();

    try {
      const result = await redis.zRangeWithScores(
        lbKey,
        cursor ?? "inf",
        "-inf",
        {
          REV: true,
          BY: "SCORE",
          LIMIT: {
            offset: 0,
            count: 10,
          },
        },
      );

      return result;
    } finally {
      await redis.quit();
    }
  }

  async updateReadersLeaderboards(
    isbn: string,
    genreIds: string[],
    status: boolean,
  ) {
    const diff = status === true ? 1 : -1;

    let redis;
    try {
      redis = getClient();

      const multi = redis.multi();
      for (const genreId of genreIds) {
        multi.ZINCRBY(getLbKey("readers", genreId), diff, isbn);
      }
      multi.ZINCRBY(getLbKey("readers", "global"), diff, isbn);

      await multi.exec();
    } finally {
      await redis?.quit();
    }
  }

  /**
   * Should be called after someone rated a book
   */
  async updateRatingLeaderboards(isbn: string, genreIds: string[]) {
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

      const multi = redis.multi();
      for (const genre of genreIds) {
        multi.zAdd(getLbKey("rating", genre), { value: isbn, score: avg });
      }
      multi.zAdd(getLbKey("rating", "global"), { value: isbn, score: avg });

      await multi.exec();

      // break;
    } catch (err) {
      console.log("Watch error");
      console.log(err);
    }
    // }

    await redis.quit();
  }
}

export const getLbKey = (criteria: "rating" | "readers", genre: string) =>
  `leaderboard:${genre}:${criteria}`;

export const leaderboardRepository = new LeaderboardRepository();
