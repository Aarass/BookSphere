import { Book } from "@interfaces/book";
import { getSession, query } from "../drivers/neo4j";
import { Rating } from "@interfaces/rating";
import { getClient } from "../drivers/redis";

class BookRepository {
  async getByISBN(isbn: string) {
    const session = getSession();

    const result = await query<Book>(
      session,
      `MATCH (a:Author)-[:WROTE]->(b:Book {isbn: $isbn}) return ${toBook("b", "a")}`,
      { isbn }
    );

    if (result.length != 1) {
      throw "Internal error";
    }

    await session.close();
    return result[0];
  }

  async getAll() {
    const session = getSession();

    const result = await query<Book>(
      session,
      `MATCH (a:Author)-[:WROTE]->(b:Book) RETURN ${toBook("b", "a")}`,
      {}
    );

    await session.close();
    return result;
  }

  async setReadingStatus(isbn: string, userId: string, status: boolean) {
    const neo4j = getSession();
    const result = await neo4j.run(
      `MATCH (b:Book {isbn: $isbn}), (u:User {id: $userId}) ${
        status == true
          ? `CREATE (u)-[:IS_READING {_start: $userId, _end: $isbn}]->(b)`
          : `MATCH (u)-[r:IS_READING]->(b) DELETE r`
      }`,
      { isbn, userId }
    );
    await neo4j.close();

    const updates = result.summary.counters.updates();
    const isDatabaseModified =
      updates.relationshipsDeleted > 0 || updates.relationshipsCreated > 0;

    if (isDatabaseModified) {
      const redis = getClient();
      if (status == true) {
        await redis.INCR(getReadingCountKey(isbn));
      } else {
        await redis.DECR(getReadingCountKey(isbn));
      }
      await redis.quit();
    }
  }

  async createComment(isbn: string, userId: string, content: string) {
    const neo4j = getSession();

    const result = await query<Comment>(
      neo4j,
      `MATCH (u:User {id: $userId}), (b:Book {isbn: $isbn})
      CREATE (u)-[r:HAS_COMMENTED {timestamp: $timestamp, comment: $content}]->(b)
      return ${toComment("r", "u", "b")}`,
      {
        timestamp: Date.now(),
        userId,
        isbn,
        content,
      }
    );

    await neo4j.close();

    if (result.length != 1) {
      throw "Internal error";
    }

    const redis = getClient();
    await redis.INCR(getCommentsCountKey(isbn));
    await redis.quit();

    return result[0];
  }

  async getComments(isbn: string) {
    const session = getSession();
    const result = await query<Comment>(
      session,
      `MATCH (u:User)-[r:HAS_COMMENTED]->(b:Book {isbn: $isbn})
      RETURN ${toComment("r", "u", "b")}`,
      { isbn }
    );
    await session.close();

    return result;
  }

  async createRating(isbn: string, userId: string, value: number) {
    const neo4j = getSession();
    await neo4j.run(
      `MATCH (u:User {id: $userId}), (b:Book {isbn: $isbn})
      CREATE (u)-[:HAS_RATED {value: $value, _start: $userId, _end: $isbn}]->(b)`,
      {
        userId,
        isbn,
        value,
      }
    );
    await neo4j.close();

    const redis = getClient();
    await redis.INCR(getRatingsCountKey(isbn));
    await redis.INCRBY(getRatingsSumKey(isbn), value);
    await redis.quit();
  }

  async getRating(isbn: string, userId: string) {
    const session = getSession();

    const result = await query<Rating>(
      session,
      `MATCH (u:User {id: $userId})-[r:HAS_RATED]->(b:Book {isbn: $isbn})
      RETURN ${toRating("r", "u", "b")}`,
      {
        userId,
        isbn,
      }
    );

    await session.close();

    if (result.length > 1) {
      throw "Internal error";
    }

    if (result.length == 1) {
      return result[0];
    } else {
      return null;
    }
  }

  async getStats(isbn: string) {
    const redis = getClient();

    const stats = (
      await redis.mGet([
        getRatingsSumKey(isbn),
        getRatingsCountKey(isbn),
        getCommentsCountKey(isbn),
        getReadingCountKey(isbn),
      ])
    ).map((s) => (s ? parseInt(s) : null));

    await redis.quit();
    return stats;
  }
}

const getRatingsSumKey = (isbn: string) => `ratings_sum:${isbn}`;
const getRatingsCountKey = (isbn: string) => `ratings_count:${isbn}`;
const getCommentsCountKey = (isbn: string) => `comments_count:${isbn}`;
const getReadingCountKey = (isbn: string) => `reading_count:${isbn}`;

export const bookRepository = new BookRepository();

function tests() {
  (async () => {
    try {
      if (false) {
        let tmp = await bookRepository.getAll();
        console.log(tmp);
      }

      if (false) {
        let tmp = await bookRepository.getByISBN("0-7567-5189-6");
        console.log(tmp);
      }

      if (false) {
        await bookRepository.setReadingStatus(
          "0-7567-5189-6",
          "43eb72c0-c592-49ed-9def-00f28a076159",
          true
        );
      }

      if (false) {
        await bookRepository.setReadingStatus(
          "0-7567-5189-6",
          "43eb72c0-c592-49ed-9def-00f28a076159",
          false
        );
      }

      if (false) {
        let tmp = await bookRepository.createComment(
          "0-7567-5189-6",
          "43eb72c0-c592-49ed-9def-00f28a076159",
          "U sto knjiga.."
        );
        console.log(tmp);
      }

      if (false) {
        let tmp = await bookRepository.getComments("0-7567-5189-6");
        console.log(tmp);
      }

      if (false) {
        await bookRepository.createRating(
          "0-7567-5189-6",
          "43eb72c0-c592-49ed-9def-00f28a076159",
          3
        );
      }

      if (false) {
        let tmp = await bookRepository.getRating(
          "0-7567-5189-6",
          "43eb72c0-c592-49ed-9def-00f28a076159"
        );
        console.log(tmp);
      }

      if (false) {
        let tmp = await bookRepository.getStats("0-7567-5189-6");
        console.log(tmp);
      }
    } catch (err) {
      console.log(err);
    }
  })();
}

// tests();

function toBook(bookVar: string, authorVar: string) {
  return `
  ${toRawBook(bookVar)},
  {id: ${authorVar}.id, fullName: ${authorVar}.fullName} as author,
  COLLECT{MATCH (b)-[:IS_OF_GENRE]->(g:Genre) return {id: g.id, name: g.name} as genre } as genres`;
}

function toRawBook(bookVar: string) {
  return `
    ${bookVar}.isbn as isbn,
    ${bookVar}.title as title,
    ${bookVar}.description as description,
    ${bookVar}.imageUrl as imageUrl
  `;
}

function toComment(
  commentRelationVar: string,
  userVar: string,
  bookVar: string
) {
  return `
    ${bookVar}.isbn as bookISBN,
    ${userVar}.id as userId,
    ${commentRelationVar}.comment as content,
    ${commentRelationVar}.timestamp as timestamp
  `;
}

function toRating(ratingRelationVar: string, userVar: string, bookVar: string) {
  return `
    ${bookVar}.isbn as bookISBN,
    ${userVar}.id as userId,
    ${ratingRelationVar}.value as rating
  `;
}
