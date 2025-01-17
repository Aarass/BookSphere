import { Book, BookWithScore } from "@interfaces/book";
import { getSession, query } from "../drivers/neo4j";
import { Rating } from "@interfaces/rating";
import { CreateCommentDto } from "@interfaces/dtos/bookDto";
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
        }
      );

      if (result.records.length != 1) {
        throw `Couldn't delete the book`;
      }

      return result.records[0].toObject().book as Book;
    } finally {
      await session.close();
    }
  }

  async setReadingStatus(isbn: string, userId: string, status: boolean) {
    const neo4j = getSession();
    let hasChanged;
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
      hasChanged =
        updates.relationshipsDeleted > 0 || updates.relationshipsCreated > 0;
    } finally {
      await neo4j.close();
    }

    return { hasChanged };
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

    return result[0];
  }

  async deleteComment(isbn: string, userId: string, dto: CreateCommentDto) {
    const neo4j = getSession();

    let result;
    try {
      result = await neo4j.run(
        `MATCH (u:User {id: $userId})-[r:HAS_COMMENTED {comment: $content}]->(b:Book {isbn: $isbn})
        DELETE r
        RETURN u, b`,
        {
          userId,
          isbn,
          content: dto.content,
        }
      )
      
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
        { isbn }
      );

      return result;
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
        }
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

  // TODO
  deleteRating(
    isbn: string,
    userId: string
  ): Promise<{ genreIds: string[]; value: number }> {
    throw new Error("Method not implemented.");
  }

  // TODO
  updateRating(
    isbn: string,
    userId: string,
    value: number
  ): Promise<{ genreIds: string[]; oldValue: number }> {
    throw new Error("Method not implemented.");
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

  async mapToBooksWithScore(
    scoresAndISBNs: { score: number; value: string }[]
  ) {
    const session = getSession();
    try {
      const result = await query<BookWithScore>(
        session,
        `UNWIND $scoresAndISBNs as scoreAndISBN
        WITH scoreAndISBN.value as isbn, scoreAndISBN.score as score
        MATCH (a:Author)-[:WROTE]->(b:Book {isbn: isbn})
        RETURN ${toBook("b", "a")}, score`,
        { scoresAndISBNs }
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
        { genre }
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
  return `COLLECT{MATCH (b)-[:IS_OF_GENRE]->(g:Genre) return g.id} as ids`;
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
