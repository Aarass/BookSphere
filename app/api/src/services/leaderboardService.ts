import { ReadLeaderboardDto } from "@interfaces/dtos/leaderboardDto";
import { leaderboardRepository } from "../repositories/leaderboardRepository";
import { bookRepository } from "../repositories/bookRepository";

async function getBooksFromLeaderboard(
  criteria: "rating" | "readers",
  genre: "global",
  dto: ReadLeaderboardDto
) {
  const scoresAndISBNs = await leaderboardRepository.getBookIdsFromLeaderboard(
    criteria,
    genre,
    dto.cursor
  );
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
