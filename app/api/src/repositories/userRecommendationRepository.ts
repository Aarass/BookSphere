import { UserRecommendationListDto } from "@interfaces/dtos/userRecommendationList";
import { RecommendationList } from "@interfaces/recommendationList";
import { ObjectId } from "mongodb";
import { getDb } from "../drivers/mongo";

const COLLECTION_NAME = "userRecommendationLists";

class UserRecommendationRepository {
  async createList(
    neo4jUserId: string,
    description: string,
  ): Promise<UserRecommendationListDto> {
    const db = getDb();
    const now = new Date();

    const result = await db.collection(COLLECTION_NAME).insertOne({
      neo4jUserId,
      description,
      bookIsbns: [],
      createdAt: now,
    });

    return {
      _id: result.insertedId.toHexString(),
      neo4jUserId,
      description,
      bookIsbns: [],
      createdAt: now,
    };
  }

  async addToList(userId: string, listId: string, isbn: string) {
    const db = getDb();

    return await db
      .collection<Omit<RecommendationList, "_id">>(COLLECTION_NAME)
      .updateOne(
        {
          _id: new ObjectId(listId),
          neo4jUserId: userId,
        },
        { $push: { bookIsbns: isbn } },
      );
  }

  async deleteFromList(userId: string, listId: string, isbn: string) {
    const db = getDb();

    return await db
      .collection<Omit<RecommendationList, "_id">>(COLLECTION_NAME)
      .updateOne(
        {
          _id: new ObjectId(listId),
          neo4jUserId: userId,
        },
        { $pull: { bookIsbns: isbn } },
      );
  }

  async getListsByUserId(
    neo4jUserId: string,
  ): Promise<UserRecommendationListDto[]> {
    const db = getDb();
    const results = await db
      .collection<UserRecommendationListDto>(COLLECTION_NAME)
      .find({ neo4jUserId })
      .sort({ createdAt: -1 })
      .toArray();

    return results.map((doc) => ({
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
}

export const userRecommendationRepository = new UserRecommendationRepository();

