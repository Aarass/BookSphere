import { Book } from "@interfaces/book";
import { getClient } from "../drivers/redis";
import { getLbKey } from "./leaderboardRepository";
import { stat } from "fs";

class StatsRepository {
  async onBookCreated(book: Book) {
    const redis = getClient();
    try {
      const gRatings = getLbKey("rating", "global");
      const gReaders = getLbKey("readers", "global");
      await redis
        .multi()
        .zAdd(gRatings, { score: 0, value: book.isbn })
        .zAdd(gReaders, { score: 0, value: book.isbn })
        .execAsPipeline();

      // TODO when lb with genres
      // This is where entries for genres should be created
    } finally {
      redis.quit();
    }
  }

  async onBookDeleted(book: Book) {
    const redis = getClient();
    try {
      const gRatings = getLbKey("rating", "global");
      const gReaders = getLbKey("readers", "global");
      await redis
        .multi()
        .zRem(gRatings, book.isbn)
        .zRem(gReaders, book.isbn)
        .del(getCommentsCountKey(book.isbn))
        .del(getRatingsCountKey(book.isbn))
        .del(getRatingsSumKey(book.isbn))
        .execAsPipeline();

      // TODO when lb with genres
      // This is where entries for genres should be deleted
    } finally {
      redis.quit();
    }
  }

  async onCommentCreated(isbn: string) {
    const redis = getClient();
    try {
      await redis.INCR(getCommentsCountKey(isbn));
    } finally {
      await redis.quit();
    }
  }

  async onCommentDeleted(isbn: string) {
    const redis = getClient();
    try {
      await redis.DECR(getCommentsCountKey(isbn));
    } finally {
      await redis.quit();
    }
  }

  async onRatingCreated(isbn: string, value: number) {
    const redis = getClient();
    try {
      await redis
        .multi()
        .incr(getRatingsCountKey(isbn))
        .incrBy(getRatingsSumKey(isbn), value)
        .execAsPipeline();
    } finally {
      await redis.quit();
    }
  }

  async onRatingDeleted(isbn: string, value: number) {
    const redis = getClient();
    try {
      await redis
        .multi()
        .decr(getRatingsCountKey(isbn))
        .decrBy(getRatingsSumKey(isbn), value)
        .execAsPipeline();
    } finally {
      await redis.quit();
    }
  }

  async onRatingUpdated(isbn: string, diff: number) {
    const redis = getClient();
    try {
      await redis.incrBy(getRatingsSumKey(isbn), diff);
    } finally {
      await redis.quit();
    }
  }

  async onReadingStatusChanged(isbn: string, status: boolean) {
    const gReaders = getLbKey("readers", "global");
    const redis = getClient();
    try {
      await redis.ZINCRBY(gReaders, status == true ? 1 : -1, isbn);
    } finally {
      await redis.quit();
    }
  }

  async getStats(isbn: string) {
    const redis = getClient();

    try {
      const stats = (
        await redis
          .multi()
          .get(getRatingsSumKey(isbn))
          .get(getRatingsCountKey(isbn))
          .get(getCommentsCountKey(isbn))
          .zScore(getLbKey("readers", "global"), isbn)
          .execAsPipeline()
      ).map((s: any) => (s ? parseInt(s) : null));

      return stats;
    } finally {
      await redis.quit();
    }
  }
}

export const getRatingsSumKey = (isbn: string) => `ratings_sum:${isbn}`;
export const getRatingsCountKey = (isbn: string) => `ratings_count:${isbn}`;
export const getCommentsCountKey = (isbn: string) => `comments_count:${isbn}`;

export const statsRepository = new StatsRepository();
