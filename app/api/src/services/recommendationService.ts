import { Book } from "@interfaces/book";
import { UserRecommendationListDto } from "@interfaces/dtos/userRecommendationList";
import { RecommendationListWithBooks } from "@interfaces/recommendationList";
import { userRecommendationRepository } from "../repositories/userRecommendationRepository";
import bookService from "./bookService";

class UserRecommendationService {
  async createList(neo4jUserId: string, description: string, bookIsbns: string[]): Promise<UserRecommendationListDto> {
    return await userRecommendationRepository.createList(neo4jUserId, description, bookIsbns);
  }

  async getListsWithBooks(neo4jUserId: string): Promise<RecommendationListWithBooks[]> {
    const lists = await userRecommendationRepository.getListsByUserId(neo4jUserId);

    const enrichedLists = await Promise.all(
      lists.map(async (list) => {
        if (!list._id) {
          throw new Error("Recommendation list is missing _id");
        }

        const books: Book[] = await Promise.all(
          list.bookIsbns.map((isbn: string) => bookService.getBookByISBN(isbn))
        );

        return {
          _id: list._id,
          neo4jUserId: list.neo4jUserId,
          description: list.description,
          books,
          createdAt: list.createdAt,
        };
      })
    );

    return enrichedLists;
  }

  async deleteList(listId: string, neo4jUserId: string): Promise<boolean> {
    const deleted = await userRecommendationRepository.deleteListById(listId, neo4jUserId);
    if (!deleted) {
      throw new Error("Lista nije pronađena ili ne pripada korisniku.");
    }

    return deleted;
  }
};


export const userRecommendationService = new UserRecommendationService();