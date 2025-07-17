import { api } from "@/app/store";
import { Book, BookRaw, ReadingStatus } from "@interfaces/book";
import { CreateBookDto, SetReadingStatus } from "@interfaces/dtos/bookDto";
import { User } from "@interfaces/user";

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
    createBook: builder.mutation<Book, CreateBookDto>({
      query: (createBookDto) => ({
        url: `/books`,
        method: "POST",
        body: createBookDto,
      }),
      invalidatesTags: [{ type: "Book", id: "LIST" }],
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
  useCreateBookMutation,
  useDeleteBookMutation,
  useGetBookStatsQuery,
  useGetBookReadingStatusQuery,
  useSetBookReadingStatusMutation,
} = apiWithBooks;
