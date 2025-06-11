import { UserRecommendationListDto } from "@interfaces/dtos/userRecommendationList";
import { ObjectId } from "mongodb";
import { getDb } from "../drivers/mongo";

const COLLECTION_NAME = "userRecommendationLists";

class UserRecommendationRepository {
  async createList(neo4jUserId: string, description: string, bookIsbns: string[]): Promise<UserRecommendationListDto> {
    if (bookIsbns.length > 5) {
      throw new Error("Lista ne može sadržavati više od 5 knjiga.");
    }

    const db = getDb();
    const now = new Date();

    const result = await db.collection(COLLECTION_NAME).insertOne({
      neo4jUserId,
      description,
      bookIsbns,
      createdAt: now,
    });

    return {
      _id: result.insertedId.toHexString(),
      neo4jUserId,
      description,
      bookIsbns,
      createdAt: now,
    };
  }

  async getListsByUserId(neo4jUserId: string): Promise<UserRecommendationListDto[]> {
    const db = getDb();
    const results = await db.collection<UserRecommendationListDto>(COLLECTION_NAME)
      .find({ neo4jUserId })
      .sort({ createdAt: -1 })
      .toArray();

    return results.map(doc => ({
      ...doc,
      _id: doc._id?.toString(),
    }));
  }

  async deleteListById(listId: string, neo4jUserId: string): Promise<boolean> {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).deleteOne({
      _id: new ObjectId(listId),
      neo4jUserId,
    });

    return result.deletedCount === 1;
  }
};

export const userRecommendationRepository = new UserRecommendationRepository();