import { ReadLeaderboardDto } from "@interfaces/dtos/leaderboardDto";
import { leaderboardRepository } from "../repositories/leaderboardRepository";
import { bookRepository } from "../repositories/bookRepository";

async function getBooksFromLeaderboard(
  criteria: "rating" | "readers",
  genreId: string,
  dto: ReadLeaderboardDto
) {
  const scoresAndISBNs = await leaderboardRepository.getBookIdsFromLeaderboard(
    criteria,
    genreId,
    dto.cursor
  );

  if (scoresAndISBNs.length === 0) {
    return [];
  }

  const books = await bookRepository.mapToBooksWithScore(scoresAndISBNs);
  return books;
}

export default {
  getBooksFromLeaderboard,
};

// (async () => {
//   const tmp = await getBooksFromLeaderboard("rating", "global", {});
//   console.log(tmp);
// })();
