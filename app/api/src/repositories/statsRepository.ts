import { Book } from "@interfaces/book";
import { getClient } from "../drivers/redis";
import { getLbKey } from "./leaderboardRepository";

class StatsRepository {
  async onBookDeleted(book: Book) {
    const redis = getClient();
    try {
      const multi = redis.multi();
      multi.del(getCommentsCountKey(book.isbn));
      multi.del(getReadersCountKey(book.isbn));
      multi.del(getRatingsCountKey(book.isbn));
      multi.del(getRatingsSumKey(book.isbn));
      await multi.execAsPipeline();
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
    const redis = getClient();
    try {
      if (status) {
        await redis.incr(getReadersCountKey(isbn));
      } else {
        await redis.decr(getReadersCountKey(isbn));
      }
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
          .get(getReadersCountKey(isbn))
          .execAsPipeline()
      ).map((s: any) => (s ? parseInt(s) : 0));

      return stats;
    } finally {
      await redis.quit();
    }
  }
}

export const getRatingsSumKey = (isbn: string) => `ratings_sum:${isbn}`;
export const getRatingsCountKey = (isbn: string) => `ratings_count:${isbn}`;
export const getCommentsCountKey = (isbn: string) => `comments_count:${isbn}`;
export const getReadersCountKey = (isbn: string) => `readers_count:${isbn}`;

export const statsRepository = new StatsRepository();
