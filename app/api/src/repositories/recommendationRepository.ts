import { BookRaw } from "@interfaces/book";
import { getSession, query } from "../drivers/neo4j";
import { toRawBook } from "./bookRepository";

class RecommendationRepository {
  async basedOnFavoriteBook(userId: string): Promise<BookRaw[]> {
    const session = getSession();

    // TODO: Ovo je prototip mora da se izmeni malo ali i ovo prolazi
    const result = await session.executeRead(async (tx) => {
      return await tx.run(
        `
          MATCH (u:User {id: $userId})-[r:HAS_RATED]->(b:Book)
          WITH u, r.value AS rating ORDER BY rating DESC LIMIT 1
          WITH u, rating AS maxRating
          
          MATCH (u)-[r2:HAS_RATED]->(favBook:Book)
          WHERE r2.value = maxRating
          WITH u, maxRating, favBook
          
          MATCH (favBook)-[:IS_OF_GENRE]->(g:Genre)
          WITH u, maxRating, favBook, collect(g) AS genres
          OPTIONAL MATCH (favBook)<-[:WROTE]-(a:Author)
          WITH u, maxRating, favBook, genres, collect(a) AS authors
          
          MATCH (otherUser:User)-[r3:HAS_RATED]->(favBook)
          WHERE otherUser <> u AND r3.value >= (maxRating - 1)
          
          MATCH (otherUser)-[r4:HAS_RATED]->(recBook:Book)
          WHERE r4.value >= (maxRating - 1)
            AND NOT EXISTS((u)-[:HAS_RATED]->(recBook))
          MATCH (recBook)-[:IS_OF_GENRE]->(g2:Genre)
          WHERE g2 IN genres
          OPTIONAL MATCH (recBook)<-[:WROTE]-(a2:Author)
          WHERE a2 IN authors
          
          RETURN recBook
          LIMIT 10
          `,
        { userId },
      );
    });

    await session.close();

    return result.records.map((record) => {
      const bookNode = record.get("recBook");

      return {
        isbn: bookNode.properties.isbn,
        title: bookNode.properties.title,
        description: bookNode.properties.description,
        imageUrl: bookNode.properties.imageUrl,
      } as BookRaw;
    });
  }

  async basedOnBookClubs(userId: string): Promise<BookRaw[]> {
    const session = getSession();

    try {
      const result = await query<BookRaw>(
        session,
        `MATCH (me:User {id: $userId})-[:IS_MEMBER_OF]->(:BookClub)<-[:IS_MEMBER_OF]-(other: User)
          WHERE other.id <> $userId
          WITH DISTINCT other, me

          MATCH (other)-[:IS_READING {status: "reading"}]->(otherBook: Book)
          WITH DISTINCT otherBook, me

          MATCH (me)-[:IS_READING]-(myBook: Book)
          WITH otherBook, COLLECT(myBook) as myBooks

          WHERE NOT otherBook IN myBooks
          RETURN ${toRawBook("otherBook")}`,
        { userId },
      );

      return result;
    } finally {
      await session.close();
    }
  }

  async basedOnTopGenres(userId: string): Promise<BookRaw[]> {
    const session = getSession();
    try {
      const result = await query<BookRaw>(
        session,
        `MATCH (me:User {id: $userId})
          MATCH (me)-[:IS_READING]->(b:Book)
          MATCH (b)-[:IS_OF_GENRE]->(g: Genre)
          WITH me, g, COUNT(*) as gCount
          ORDER BY gCount
          LIMIT 3

          MATCH (g)<-[:IS_OF_GENRE]-(b: Book)
          WHERE NOT EXISTS{ (me)-[:IS_READING]->(b) }
          WITH b, COUNT{ (b)<-[:IS_READING]-() } as score
          ORDER BY score DESC
          LIMIT 10
          RETURN DISTINCT ${toRawBook("b")}`,
        { userId },
      );

      return result;
    } finally {
      await session.close();
    }
  }
}

export const recommendationRepository = new RecommendationRepository();

