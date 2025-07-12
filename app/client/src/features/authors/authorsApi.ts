import { api } from "@/app/store";
import { Author } from "@interfaces/author";

export const apiWithAuthors = api.injectEndpoints({
  endpoints: (builder) => ({
    getAuthors: builder.query<Author[], void>({
      query: () => `/authors`,
    }),
  }),
});

export const { useGetAuthorsQuery } = apiWithAuthors;
