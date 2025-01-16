import { Book } from "@interfaces/book";
import { getSession, query } from "../drivers/neo4j";
import { Rating } from "@interfaces/rating";
import { getClient } from "../drivers/redis";

class BookRepository {
  async createBook(
    isbn: string,
    title: string,
    description: string,
    imageUrl: string,
    authorId: string,
    genreIds: string[]
  ) {
    const session = getSession();

    try {
      const tx = session.beginTransaction();
      try {
        const result = await tx.run(
          `
          CREATE (b:Book {isbn: $isbn, title: $title, description: $description, imageUrl: $imageUrl}) WITH b
          MATCH (a:Author {id: $authorId})
          CREATE (a)-[:WROTE]->(b)

          WITH b, a
          UNWIND $genreIds as genreId
            MATCH (g:Genre {id: genreId})
            CREATE (b)-[:IS_OF_GENRE]->(g)
          RETURN ${toRawBook("b")}, {id: a.id, fullName: a.fullName} as author, collect(genreId) as genreIds
          `,
          {
            isbn,
            title,
            description,
            imageUrl,
            authorId,
            genreIds,
          }
        );

        const updates = result.summary.counters.updates();
        if (updates.nodesCreated != 1) {
          throw {
            type: "customError",
            message: "Book already exists",
          };
        } else if (updates.relationshipsCreated != 1 + genreIds.length) {
          throw {
            type: "customError",
            message:
              "Either authorId was wrong or some of the genreIds were wrong",
          };
        }

        await tx.commit();

        return result.records[0].toObject() as Book;
      } catch (error) {
        await tx.rollback();
        throw error;
      } finally {
        await tx.close();
      }

      // const result = await query<Book>(
      //   session,
      //   `
      //   MERGE (b:Book {isbn: $isbn, title: $title, description: $description, imageUrl: $imageUrl}) WITH b
      //   MATCH (a:Author {id: $authorId})
      //   MERGE (a)-[:WROTE]->(b)

      //   WITH b, a
      //   UNWIND $genreIds as genreId
      //     MATCH (g:Genre {id: genreId})
      //     MERGE (b)-[:IS_OF_GENRE]->(g)
      //   RETURN ${toRawBook("b")}, {id: a.id, fullName: a.fullName} as author, collect(genreId) as genreIds
      //   `,
      //   {
      //     isbn,
      //     title,
      //     description,
      //     imageUrl,
      //     authorId,
      //     genreIds,
      //   }
      // );

      // if (result.length != 1) {
      //   throw "Internal error";
      // }

      // return result[0];
    } finally {
      await session.close();
    }
  }

  async getByISBN(isbn: string) {
    let result;

    const session = getSession();
    try {
      result = await query<Book>(
        session,
        `MATCH (a:Author)-[:WROTE]->(b:Book {isbn: $isbn}) return ${toBook("b", "a")}`,
        { isbn }
      );
    } finally {
      await session.close();
    }

    if (result.length != 1) {
      throw "Internal error";
    }

    return result[0];
  }

  async getAll() {
    const session = getSession();

    try {
      const result = await query<Book>(
        session,
        `MATCH (a:Author)-[:WROTE]->(b:Book) RETURN ${toBook("b", "a")}`,
        {}
      );

      return result;
    } finally {
      await session.close();
    }
  }

  async delete(isbn: string) {
    const session = getSession();
    try {
      await session.run(`MATCH (b:Book {isbn: $isbn}) DETACH DELETE b`, {
        isbn,
      });
    } finally {
      await session.close();
    }
  }

  async setReadingStatus(isbn: string, userId: string, status: boolean) {
    const neo4j = getSession();
    let isDatabaseModified;
    try {
      const result = await neo4j.run(
        `MATCH (b:Book {isbn: $isbn}), (u:User {id: $userId}) ${
          status == true
            ? `CREATE (u)-[:IS_READING {_start: $userId, _end: $isbn}]->(b)`
            : `MATCH (u)-[r:IS_READING]->(b) DELETE r`
        }`,
        { isbn, userId }
      );

      const updates = result.summary.counters.updates();
      isDatabaseModified =
        updates.relationshipsDeleted > 0 || updates.relationshipsCreated > 0;
    } finally {
      await neo4j.close();
    }

    if (isDatabaseModified) {
      const redis = getClient();
      try {
        if (status == true) {
          await redis.INCR(getReadingCountKey(isbn));
        } else {
          await redis.DECR(getReadingCountKey(isbn));
        }
      } finally {
        await redis.quit();
      }
    }
  }

  async createComment(isbn: string, userId: string, content: string) {
    const neo4j = getSession();

    let result;
    try {
      result = await query<Comment>(
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
    } finally {
      await neo4j.close();
    }

    if (result.length != 1) {
      throw "Couldn't create comment";
    }

    const redis = getClient();
    try {
      await redis.INCR(getCommentsCountKey(isbn));
    } finally {
      await redis.quit();
    }

    return result[0];
  }

  async getComments(isbn: string) {
    const session = getSession();
    try {
      const result = await query<Comment>(
        session,
        `MATCH (u:User)-[r:HAS_COMMENTED]->(b:Book {isbn: $isbn})
        RETURN ${toComment("r", "u", "b")}`,
        { isbn }
      );

      return result;
    } finally {
      await session.close();
    }
  }

  async createRating(isbn: string, userId: string, value: number) {
    const neo4j = getSession();
    let result;
    try {
      result = await neo4j.run(
        `MATCH (u:User {id: $userId}), (b:Book {isbn: $isbn})
      CREATE (u)-[:HAS_RATED {value: $value, _start: $userId, _end: $isbn}]->(b)`,
        {
          userId,
          isbn,
          value,
        }
      );
    } finally {
      await neo4j.close();
    }

    const updates = result.summary.counters.updates();
    if (updates.relationshipsCreated != 1) {
      throw "Couldn't create rating";
    }

    const redis = getClient();
    try {
      await redis.INCR(getRatingsCountKey(isbn));
      await redis.INCRBY(getRatingsSumKey(isbn), value);
    } finally {
      await redis.quit();
    }
  }

  async getRating(isbn: string, userId: string) {
    const session = getSession();

    try {
      const result = await query<Rating>(
        session,
        `MATCH (u:User {id: $userId})-[r:HAS_RATED]->(b:Book {isbn: $isbn})
      RETURN ${toRating("r", "u", "b")}`,
        {
          userId,
          isbn,
        }
      );

      if (result.length > 1) {
        throw "Internal error";
      }

      if (result.length == 1) {
        return result[0];
      } else {
        return null;
      }
    } finally {
      await session.close();
    }
  }

  async getStats(isbn: string) {
    const redis = getClient();

    try {
      const stats = (
        await redis.mGet([
          getRatingsSumKey(isbn),
          getRatingsCountKey(isbn),
          getCommentsCountKey(isbn),
          getReadingCountKey(isbn),
        ])
      ).map((s: any) => (s ? parseInt(s) : null));

      return stats;
    } finally {
      await redis.quit();
    }
  }

  async getBooksByGenre(genre: string): Promise<string[]> {
    const session = getSession();
    try {
      const result = await session.run(
        `
      MATCH (b:Book)-[:BELONGS_TO]->(:Genre {name: $genre})
      RETURN b.isbn AS isbn
      `,
        { genre }
      );

      return result.records.map((record: any) => record.get("isbn"));
    } finally {
      await session.close();
    }
  }

  async getRankedBooksByGenre(genre: string): Promise<string[]> {
    const redis = getClient();

    const bookIsbns = await this.getBooksByGenre(genre);

    const booksWithRatings = await Promise.all(
      bookIsbns.map(async (isbn) => {
        const count = await redis.get(getRatingsCountKey(isbn));
        const sum = await redis.get(getRatingsSumKey(isbn));

        const ratingsCount = count ? parseInt(count, 10) : 0;
        const ratingsSum = sum ? parseInt(sum, 10) : 0;

        const averageRating = ratingsCount > 0 ? ratingsSum / ratingsCount : 0;

        return { isbn, averageRating };
      })
    );

    booksWithRatings.sort((a, b) => b.averageRating - a.averageRating);

    return booksWithRatings.map((book) => book.isbn);
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

      if (false) {
        bookRepository.createBook("1", "Title", "Description", "asd.jpg", "1", [
          "2",
        ]);
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
