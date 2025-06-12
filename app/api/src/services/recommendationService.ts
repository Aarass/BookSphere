import { BookRaw } from "@interfaces/book";
import { recommendationRepository } from "../repositories/recommendationRepository";

class RecommendationService {
  async getRecommendations(userId: string): Promise<BookRaw[]> {
    const books: BookRaw[] = await recommendationRepository.getRecommendations(userId);

    if (books.length === 0) {
      return [];
    }
    return books.map((book) => ({
      isbn: book.isbn,
      title: book.title,
      description: book.description,
      imageUrl: book.imageUrl,
    }));
  }
}

export const recommendationService = new RecommendationService();
