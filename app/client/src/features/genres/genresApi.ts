import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { backend } from "@/constants";
import { Genre } from "@interfaces/genre";

export const genresApi = createApi({
  reducerPath: "genres",
  baseQuery: fetchBaseQuery({ baseUrl: backend }),
  endpoints: (builder) => ({
    getGenres: builder.query<Genre[], void>({
      query: () => `/genres`,
    }),
  }),
});

export const { useGetGenresQuery } = genresApi;
