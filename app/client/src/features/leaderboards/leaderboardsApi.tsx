import { api } from "@/app/store";
import { BookWithScore } from "@interfaces/book";
import { Genre } from "@interfaces/genre";

export const apiWithLeaderboards = api.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboard: builder.query<
      BookWithScore[],
      { criteria: "rating" | "readers"; genreId: Genre["id"] | "global" }
    >({
      query: ({ criteria, genreId }) => `/leaderboards/${criteria}/${genreId}`,
    }),
  }),
});

export const { useGetLeaderboardQuery } = apiWithLeaderboards;
