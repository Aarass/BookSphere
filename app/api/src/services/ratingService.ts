import { CreateRatingDto, UpdateRatingDto } from "@interfaces/dtos/bookDto";
import { bookRepository } from "../repositories/bookRepository";
import { leaderboardRepository } from "../repositories/leaderboardRepository";
import { statsRepository } from "../repositories/statsRepository";

async function createRating(
  isbn: string,
  userId: string,
  dto: CreateRatingDto
) {
  const { genreIds } = await bookRepository.createRating(
    isbn,
    userId,
    dto.value
  );

  setImmediate(async () => {
    await statsRepository.onRatingCreated(isbn, dto.value);
    await leaderboardRepository.updateRatingLeaderboard(isbn, "global");
  });
}

async function updateRating(
  isbn: string,
  userId: string,
  dto: UpdateRatingDto
) {
  const { genreIds, oldValue } = await bookRepository.updateRating(
    isbn,
    userId,
    dto.value
  );

  setImmediate(async () => {
    const diff = dto.value - oldValue;
    await statsRepository.onRatingUpdated(isbn, diff);
    await leaderboardRepository.updateRatingLeaderboard(isbn, "global");
  });
}

async function deleteRating(isbn: string, userId: string) {
  const { genreIds, value } = await bookRepository.deleteRating(isbn, userId);

  setImmediate(async () => {
    await statsRepository.onRatingDeleted(isbn, value);
    await leaderboardRepository.updateRatingLeaderboard(isbn, "global");
  });
}

async function getUserRating(isbn: string, userId: string) {
  return await bookRepository.getRating(isbn, userId);
}

export default {
  createRating,
  getUserRating,
};
