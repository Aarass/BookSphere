import { api } from "@/app/store";
import { Book } from "@interfaces/book";
import { CreateRatingDto, UpdateRatingDto } from "@interfaces/dtos/bookDto";
import { Rating } from "@interfaces/rating";

export const apiWithRating = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyBookRating: builder.query<Rating | null, Book["isbn"]>({
      query: (isbn) => `/books/${isbn}/ratings/my`,
      providesTags: (_result, _error, isbn) => [
        {
          type: "MyBookRating",
          id: isbn,
        },
      ],
    }),
    createBookRating: builder.mutation<
      void,
      { isbn: Book["isbn"]; value: number }
    >({
      query: ({ isbn, value }) => ({
        url: `/books/${isbn}/ratings`,
        method: "POST",
        body: {
          value,
        } satisfies CreateRatingDto,
      }),
      invalidatesTags: (_result, _error, { isbn }) => [
        {
          type: "MyBookRating",
          id: isbn,
        },
        { type: "BookStats", id: isbn },
      ],
    }),
    updateBookRating: builder.mutation<
      void,
      { isbn: Book["isbn"]; value: number }
    >({
      query: ({ isbn, value }) => ({
        url: `/books/${isbn}/ratings`,
        method: "PUT",
        body: {
          value,
        } satisfies UpdateRatingDto,
      }),
      invalidatesTags: (_result, _error, { isbn }) => [
        {
          type: "MyBookRating",
          id: isbn,
        },
        { type: "BookStats", id: isbn },
      ],
    }),
    deleteBookRating: builder.mutation<void, Book["isbn"]>({
      query: (isbn) => ({
        url: `/books/${isbn}/ratings`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, isbn) => [
        {
          type: "MyBookRating",
          id: isbn,
        },
        { type: "BookStats", id: isbn },
      ],
    }),
  }),
});

export const {
  useGetMyBookRatingQuery,
  useCreateBookRatingMutation,
  useUpdateBookRatingMutation,
  useDeleteBookRatingMutation,
} = apiWithRating;
