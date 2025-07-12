import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { backend } from "@/constants";
import { Author } from "@interfaces/author";

export const authorsApi = createApi({
  reducerPath: "authors",
  baseQuery: fetchBaseQuery({ baseUrl: backend }),
  endpoints: (builder) => ({
    getAuthors: builder.query<Author[], void>({
      query: () => `/authors`,
    }),
  }),
});

export const { useGetAuthorsQuery } = authorsApi;
