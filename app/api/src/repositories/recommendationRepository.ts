import { BookRaw } from "@interfaces/book";
import { getSession } from "../drivers/neo4j";

class RecommendationRepository {
  async getRecommendations(userId: string): Promise<BookRaw[]> {
    const session = getSession();


    const result = await session.executeRead(async tx => {
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
        { userId }
      );
    });

    await session.close();

    return result.records.map((record) => {
      const bookNode = record.get('recBook');

      return {
        isbn: bookNode.properties.isbn,
        title: bookNode.properties.title,
        description: bookNode.properties.description,
        imageUrl: bookNode.properties.imageUrl,
      } as BookRaw;
    });


  }
}

export const recommendationRepository = new RecommendationRepository();