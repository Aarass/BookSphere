import { api } from "@/app/store";
import { Genre } from "@interfaces/genre";

export const apiWithGenres = api.injectEndpoints({
  endpoints: (builder) => ({
    getGenres: builder.query<Genre[], void>({
      query: () => `/genres`,
    }),
  }),
});

export const { useGetGenresQuery } = apiWithGenres;
