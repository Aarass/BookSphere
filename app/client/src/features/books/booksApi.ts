import { api } from "@/app/store";
import type { Book, BookRaw, ReadingStatus } from "@interfaces/book";
import type {
  CreateBookDto,
  SetReadingStatus,
  UpdateBookDto,
} from "@interfaces/dtos/bookDto";
import type { User } from "@interfaces/user";
import { toast } from "sonner";

export const apiWithBooks = api.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<Book[], void>({
      query: () => `/books`,
      providesTags: (result = []) => [
        { type: "Book", id: "LIST" },
        ...result.map((book) => ({ type: "Book", id: book.isbn }) as const),
      ],
    }),
    getBook: builder.query<Book, Book["isbn"]>({
      query: (isbn) => `/books/${isbn}`,
      providesTags: (_result, _error, isbn) => {
        return [{ type: "Book", id: isbn }];
      },
    }),
    getCurrentlyReadingBooks: builder.query<BookRaw[], User["id"]>({
      query: (userId) => `/users/${userId}/books/reading`,
      providesTags: [{ type: "BookList", id: "READING" }],
    }),
    getCompletedBooks: builder.query<BookRaw[], User["id"]>({
      query: (userId) => `/users/${userId}/books/completed`,
      providesTags: [{ type: "BookList", id: "COMPLETED" }],
    }),
    getRecommendedBooks: builder.query<
      BookRaw[],
      "favorite" | "clubs" | "genres"
    >({
      query: (type) => `/recommendations/me/${type}`,
      providesTags: [{ type: "BookList", id: "RECOMMENDED" }],
    }),
    createBook: builder.mutation<Book, CreateBookDto>({
      query: (createBookDto) => ({
        url: `/books`,
        method: "POST",
        body: createBookDto,
      }),
      invalidatesTags: [{ type: "Book", id: "LIST" }],
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          toast("Successfully created a book");
        } catch {
          toast("There was an error while trying to create a book");
        }
      },
    }),
    updateBook: builder.mutation<Book, UpdateBookDto>({
      query: (payload) => ({
        url: `/books`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result) => [
        { type: "Book", id: "LIST" },
        { type: "Book", id: result?.isbn || "LIST" },
      ],
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          toast("Successfully updated a book");
        } catch {
          toast("There was an error while trying to update a book");
        }
      },
    }),
    deleteBook: builder.mutation<void, Book["isbn"]>({
      query: (isbn) => ({
        url: `/books/${isbn}`,
        method: "DELETE",
        responseHandler: "text",
      }),
      invalidatesTags: (_result, _error, isbn) => {
        return [
          { type: "Book", id: "LIST" },
          { type: "Book", id: isbn },
        ];
      },
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          toast("Successfully deleted a book");
        } catch {
          toast("There was an error while trying to delete a book");
        }
      },
    }),
    // -----------------------------------------------------------------------
    // TODO dodati edit i na frontu i na beku
    // -----------------------------------------------------------------------
    getBookStats: builder.query<number[] /*TODO */, Book["isbn"]>({
      query: (isbn) => `/books/${isbn}/stats`,
      providesTags: (_result, _error, isbn) => {
        return [{ type: "BookStats", id: isbn }];
      },
    }),
    getBookReadingStatus: builder.query<ReadingStatus, Book["isbn"]>({
      query: (isbn) => `/books/${isbn}/reading-status`,

      providesTags: (_result, _error, isbn) => {
        return [{ type: "BookReadingStatus", id: isbn }];
      },
    }),
    setBookReadingStatus: builder.mutation<
      void,
      { isbn: Book["isbn"]; dto: SetReadingStatus }
    >({
      query: ({ isbn, dto }) => ({
        url: `/books/${isbn}/reading-status`,
        method: "PUT",
        body: dto,
        responseHandler: "text",
      }),
      invalidatesTags: (_result, _error, { isbn }) => {
        return [
          { type: "BookReadingStatus", id: isbn },
          { type: "BookStats", id: isbn },
          { type: "BookList", id: "READING" },
          { type: "BookList", id: "COMPLETED" },
          { type: "BookList", id: "RECOMMENDED" },
        ];
      },
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookQuery,
  useGetCurrentlyReadingBooksQuery,
  useGetCompletedBooksQuery,
  useGetRecommendedBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useGetBookStatsQuery,
  useGetBookReadingStatusQuery,
  useSetBookReadingStatusMutation,
} = apiWithBooks;
