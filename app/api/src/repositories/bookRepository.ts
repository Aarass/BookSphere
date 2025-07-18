import { Book, BookRaw, BookWithScore, ReadingStatus } from "@interfaces/book";
import { getSession, query } from "../drivers/neo4j";
import { Rating } from "@interfaces/rating";
import { Comment } from "@interfaces/comment";

class BookRepository {
  async createBook(
    isbn: string,
    title: string,
    description: string,
    imageUrl: string,
    authorId: string,
    genreIds: string[],
  ) {
    const session = getSession();
    let newBook;
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
          RETURN ${toBook("b", "a")}
          `,
          {
            isbn,
            title,
            description,
            imageUrl,
            authorId,
            genreIds,
          },
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

        newBook = result.records[0].toObject() as Book;
        await tx.commit();
      } catch (error) {
        await tx.rollback();
        throw error;
      } finally {
        await tx.close();
      }
    } finally {
      await session.close();
    }

    return newBook;
  }

  async getByISBN(isbn: string) {
    let result;

    const session = getSession();
    try {
      result = await query<Book>(
        session,
        `MATCH (a:Author)-[:WROTE]->(b:Book {isbn: $isbn}) return ${toBook("b", "a")}`,
        { isbn },
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
        {},
      );

      return result;
    } finally {
      await session.close();
    }
  }

  async getBooksWithReadingStatus(
    userId: string,
    status: ReadingStatus["status"],
  ) {
    const session = getSession();

    try {
      const result = await query<BookRaw>(
        session,
        `MATCH (u:User {id: $userId})-[:IS_READING {status: $status}]->(b:Book) RETURN ${toRawBook("b")}`,
        { userId, status },
      );

      return result;
    } finally {
      await session.close();
    }
  }

  async delete(isbn: string) {
    const session = getSession();
    try {
      const result = await session.run(
        `MATCH (a:Author)-[:WROTE]->(b:Book {isbn: $isbn})
        WITH b, {
          isbn: b.isbn,
          title: b.title,
          description: b.description,
          imageUrl: b.imageUrl,
          author: { id: a.id, fullName: a.fullName},
          genres: COLLECT{MATCH (b)-[:IS_OF_GENRE]->(g:Genre) return {id: g.id, name: g.name}}
        } as book 
        DETACH DELETE b 
        RETURN book`,
        {
          isbn,
        },
      );

      if (result.records.length != 1) {
        throw `Couldn't delete the book`;
      }

      return result.records[0].toObject().book as Book;
    } finally {
      await session.close();
    }
  }

  async getReadingStatus(isbn: string, userId: string): Promise<ReadingStatus> {
    const session = getSession();

    try {
      const result = await query(
        session,
        `MATCH (u:User {id: $userId})-[r:IS_READING]->(b:Book {isbn: $isbn}) RETURN r.status as status`,
        {
          userId,
          isbn,
        },
      );

      if (result.length === 0) {
        return {
          status: "null",
        };
      }

      if (result.length !== 1) {
        throw "Internal error";
      }

      return {
        status: result[0]["status"],
      };
    } finally {
      await session.close();
    }
  }

  async setReadingStatus(
    isbn: string,
    userId: string,
    status: ReadingStatus["status"],
  ) {
    const neo4j = getSession();
    let result;
    try {
      switch (status) {
        case "null":
          result = await neo4j.run(
            `MATCH (:User {id: $userId})-[r:IS_READING]->(b:Book {isbn: $isbn})
              WITH r, b, r.status as oldStatus
              DELETE r 
              RETURN ${toGenreIds("b")}, oldStatus`,
            { isbn, userId },
          );
          break;
        case "reading":
        case "completed":
          result = await neo4j.run(
            `OPTIONAL MATCH (:User {id: $userId})-[r:IS_READING]->(:Book {isbn: $isbn})
              WITH r.status as oldStatus
              MATCH (u: User {id: $userId}), (b:Book {isbn: $isbn})
              MERGE (u)-[r:IS_READING]->(b)
              SET r.status = $status
              RETURN ${toGenreIds("b")}, oldStatus`,
            { isbn, userId, status },
          );
          break;
        default:
          status satisfies never;
          throw new Error("Developer errror");
      }

      if (result.records.length != 1) {
        throw "Couldn't update reading status";
      }

      const record = result.records[0].toObject();

      return {
        previousValue: record.oldStatus as ReadingStatus["status"],
        genreIds: record.ids,
      };
    } finally {
      await neo4j.close();
    }
  }

  async createComment(isbn: string, userId: string, content: string) {
    const neo4j = getSession();

    let result;
    try {
      result = await query<Comment>(
        neo4j,
        `MATCH (u:User {id: $userId}), (b:Book {isbn: $isbn})
      CREATE (u)-[r:HAS_COMMENTED {timestamp: $timestamp, comment: $content, _start: $userId, _end: $isbn}]->(b)
      return ${toComment("r", "u", "b")}`,
        {
          timestamp: Date.now(),
          userId,
          isbn,
          content,
        },
      );
    } finally {
      await neo4j.close();
    }

    if (result.length != 1) {
      throw "Couldn't create comment";
    }

    return result[0];
  }

  async updateComment(isbn: string, userId: string, newContent: string) {
    const session = getSession();
    let result;

    try {
      result = await session.run(
        `MATCH (:User {id: $userId})-[r:HAS_COMMENTED]->(:Book {isbn: $isbn})
         SET r.comment = $content, r.timestamp = $timestamp`,
        {
          userId,
          isbn,
          timestamp: Date.now(),
          content: newContent,
        },
      );
    } finally {
      await session.close();
    }

    const updates = result.summary.counters.updates();

    if (updates.propertiesSet !== 2) {
      console.error(
        `Error updating comment. Expected 2# properties set. Instead set ${updates.propertiesSet}# properties`,
      );
      throw "Couldn't update comment";
    }
  }

  async deleteComment(isbn: string, userId: string) {
    const neo4j = getSession();

    let result;
    try {
      result = await neo4j.run(
        `MATCH (:User {id: $userId})-[r:HAS_COMMENTED]->(:Book {isbn: $isbn}) DELETE r`,
        {
          userId,
          isbn,
        },
      );

      const updates = result.summary.counters.updates();

      if (updates.relationshipsDeleted != 1) {
        throw "Couldn't delete commennt";
      }

      return { message: "Comment deleted successfully" };
    } finally {
      await neo4j.close();
    }
  }

  async getComments(isbn: string) {
    const session = getSession();
    try {
      const result = await query<Comment>(
        session,
        `MATCH (u:User)-[r:HAS_COMMENTED]->(b:Book {isbn: $isbn})
        RETURN ${toComment("r", "u", "b")}`,
        { isbn },
      );

      return result;
    } finally {
      await session.close();
    }
  }

  async getComment(userId: string, isbn: string): Promise<Comment | null> {
    const session = getSession();
    try {
      const result = await query<Comment>(
        session,
        `MATCH (u:User {id: $userId})-[r:HAS_COMMENTED]->(b:Book {isbn: $isbn})
        RETURN ${toComment("r", "u", "b")}`,
        { userId, isbn },
      );

      if (result.length > 1) {
        throw "Internal error";
      }

      if (result.length === 0) {
        return null;
      }

      return result[0];
    } finally {
      await session.close();
    }
  }

  async createRating(isbn: string, userId: string, value: number) {
    const session = getSession();
    let result;
    try {
      result = await session.run(
        `MATCH (u:User {id: $userId}), (b:Book {isbn: $isbn})
        CREATE (u)-[:HAS_RATED {value: $value, _start: $userId, _end: $isbn}]->(b)
        RETURN ${toGenreIds("b")}`,
        {
          userId,
          isbn,
          value,
        },
      );
    } finally {
      await session.close();
    }

    const updates = result.summary.counters.updates();
    if (updates.relationshipsCreated != 1) {
      throw "Couldn't create rating";
    }

    if (result.records.length != 1) {
      throw `Internal error`;
    }

    return result.records[0].toObject() as { ids: string[] };
  }

  async deleteRating(
    isbn: string,
    userId: string,
  ): Promise<{ genreIds: string[]; value: number }> {
    const session = getSession();
    let result;

    try {
      result = await session.run(
        `MATCH (u:User {id: $userId})-[r:HAS_RATED]->(b:Book {isbn: $isbn})
        WITH b, r, r.value AS value
        DELETE r
        RETURN ${toGenreIds("b")}, value`,
        { userId, isbn },
      );
    } finally {
      await session.close();
    }

    if (result.records.length != 1) {
      throw "Couldn't delete rating";
    }

    const record = result.records[0].toObject();

    return {
      genreIds: record.ids,
      value: record.value,
    };
  }

  // TODO
  async updateRating(
    isbn: string,
    userId: string,
    value: number,
  ): Promise<{ genreIds: string[]; oldValue: number }> {
    const session = getSession();
    let result;

    try {
      result = await session.run(
        `MATCH (u:User {id: $userId})-[r:HAS_RATED]->(b:Book {isbn: $isbn})
        WITH b, r,  r.value AS oldValue
        SET r.value = $value
        RETURN ${toGenreIds("b")}, oldValue`,
        { userId, isbn, value },
      );
    } finally {
      await session.close();
    }

    if (result.records.length != 1) {
      throw "Coulden't update rating";
    }

    const record = result.records[0].toObject();

    return {
      genreIds: record.ids,
      oldValue: record.oldValue,
    };
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
        },
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

  async mapToBooksWithScore(
    scoresAndISBNs: { score: number; value: string }[],
  ) {
    const session = getSession();
    try {
      const result = await query<BookWithScore>(
        session,
        `UNWIND $scoresAndISBNs as scoreAndISBN
        WITH scoreAndISBN.value as isbn, scoreAndISBN.score as score
        MATCH (a:Author)-[:WROTE]->(b:Book {isbn: isbn})
        RETURN ${toBook("b", "a")}, score`,
        { scoresAndISBNs },
      );

      return result;
    } finally {
      await session.close();
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
        { genre },
      );

      return result.records.map((record: any) => record.get("isbn"));
    } finally {
      await session.close();
    }
  }
}

export const bookRepository = new BookRepository();

function toBook(bookVar: string, authorVar: string) {
  return `
  ${toRawBook(bookVar)},
  {id: ${authorVar}.id, fullName: ${authorVar}.fullName} as author,
  COLLECT{MATCH (b)-[:IS_OF_GENRE]->(g:Genre) return {id: g.id, name: g.name} as genre } as genres`;
}

function toGenreIds(bookVar: string) {
  return `COLLECT{MATCH (${bookVar})-[:IS_OF_GENRE]->(g:Genre) return g.id} as ids`;
}

export function toRawBook(bookVar: string) {
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
  bookVar: string,
) {
  return `
    ${bookVar}.isbn as bookISBN,
    ${userVar}.id as authorId,
    ${commentRelationVar}.comment as content,
    ${commentRelationVar}.timestamp as timestamp
  `;
}

function toRating(ratingRelationVar: string, userVar: string, bookVar: string) {
  return `
    ${bookVar}.isbn as bookISBN,
    ${userVar}.id as userId,
    ${ratingRelationVar}.value as value
  `;
}

async function tests() {
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
      true,
    );
  }

  if (false) {
    await bookRepository.setReadingStatus(
      "0-7567-5189-6",
      "43eb72c0-c592-49ed-9def-00f28a076159",
      false,
    );
  }

  if (false) {
    let tmp = await bookRepository.createComment(
      "0-7567-5189-6",
      "43eb72c0-c592-49ed-9def-00f28a076159",
      "U sto knjiga..",
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
      3,
    );
  }

  if (false) {
    let tmp = await bookRepository.getRating(
      "0-7567-5189-6",
      "43eb72c0-c592-49ed-9def-00f28a076159",
    );
    console.log(tmp);
  }

  if (false) {
    bookRepository.createBook("1", "Title", "Description", "asd.jpg", "1", [
      "2",
    ]);
  }
}

// (async () => {
//   try {
//     tests();
//   } catch (err) {
//     console.log(err);
//   }
// })();
