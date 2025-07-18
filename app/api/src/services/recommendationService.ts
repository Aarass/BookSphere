import { BookRaw } from "@interfaces/book";
import { recommendationRepository } from "../repositories/recommendationRepository";

class RecommendationService {
  async getRecommendations(userId: string, type: string): Promise<BookRaw[]> {
    switch (type) {
      case "favorite":
        return await recommendationRepository.basedOnFavoriteBook(userId);
      case "clubs":
        return await recommendationRepository.basedOnBookClubs(userId);
      default:
        throw new Error("Not supported");
    }
  }
}

export const recommendationService = new RecommendationService();
