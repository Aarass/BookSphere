import { api } from "@/app/store";
import { Book } from "@interfaces/book";
import { Comment } from "@interfaces/comment";
import { CreateCommentDto } from "@interfaces/dtos/bookDto";

export const apiWithComments = api.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query<Comment[], Book["isbn"]>({
      query: (isbn) => `/books/${isbn}/comments`,
      providesTags: (_result, _error, isbn) => [
        {
          type: "BookComments",
          id: isbn,
        },
      ],
    }),
    createComment: builder.mutation<
      void,
      { isbn: Book["isbn"]; dto: CreateCommentDto }
    >({
      query: ({ isbn, dto }) => ({
        url: `/books/${isbn}/comments`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: (_result, _error, { isbn }) => [
        {
          type: "BookComments",
          id: isbn,
        },
        { type: "BookStats", id: isbn },
      ],
    }),
    // updateBookRating: builder.mutation<
    //   void,
    //   { isbn: Book["isbn"]; value: number }
    // >({
    //   query: ({ isbn, value }) => ({
    //     url: `/books/${isbn}/ratings`,
    //     method: "PUT",
    //     body: {
    //       value,
    //     } satisfies UpdateRatingDto,
    //   }),
    //   invalidatesTags: (_result, _error, { isbn }) => [
    //     {
    //       type: "MyBookRating",
    //       id: isbn,
    //     },
    //     { type: "BookStats", id: isbn },
    //   ],
    // }),
    // deleteBookRating: builder.mutation<void, Book["isbn"]>({
    //   query: (isbn) => ({
    //     url: `/books/${isbn}/ratings`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: (_result, _error, isbn) => [
    //     {
    //       type: "MyBookRating",
    //       id: isbn,
    //     },
    //     { type: "BookStats", id: isbn },
    //   ],
    // }),
  }),
});

export const { useGetCommentsQuery, useCreateCommentMutation } =
  apiWithComments;
