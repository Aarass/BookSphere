import { api } from "@/app/store";
import { Book } from "@interfaces/book";
import { Comment } from "@interfaces/comment";
import { CreateCommentDto, UpdateCommentDto } from "@interfaces/dtos/bookDto";
import { toast } from "sonner";

export const apiWithComments = api.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query<Comment[], Book["isbn"]>({
      query: (isbn) => `/books/${isbn}/comments`,
      providesTags: (_result, _error, isbn) => [
        {
          type: "BookComment",
          id: `LIST ${isbn}`,
        },
      ],
    }),
    getMyComment: builder.query<Comment | null, Book["isbn"]>({
      query: (isbn) => `/books/${isbn}/comments/my`,
      providesTags: (_result, _error, isbn) => [
        {
          type: "BookComment",
          id: `MY ${isbn}`,
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
      onCacheEntryAdded: () => {
        toast("Comment successfully posted");
      },
      invalidatesTags: (_result, _error, { isbn }) => [
        {
          type: "BookComment",
          id: `LIST ${isbn}`,
        },
        {
          type: "BookComment",
          id: `MY ${isbn}`,
        },
        { type: "BookStats", id: isbn },
      ],
    }),
    updateMyComment: builder.mutation<
      void,
      { isbn: Book["isbn"]; dto: UpdateCommentDto }
    >({
      query: ({ isbn, dto }) => ({
        url: `/books/${isbn}/comments/my`,
        method: "PUT",
        body: dto,
      }),
      onCacheEntryAdded: () => {
        toast("Comment successfully updated");
      },
      invalidatesTags: (_result, _error, { isbn }) => [
        {
          type: "BookComment",
          id: `LIST ${isbn}`,
        },
        {
          type: "BookComment",
          id: `MY ${isbn}`,
        },
      ],
    }),
    deleteMyComment: builder.mutation<void, { isbn: Book["isbn"] }>({
      query: ({ isbn }) => ({
        url: `/books/${isbn}/comments/my`,
        method: "DELETE",
      }),
      onCacheEntryAdded: () => {
        toast("Comment successfully deleted");
      },
      invalidatesTags: (_result, _error, { isbn }) => [
        {
          type: "BookComment",
          id: `LIST ${isbn}`,
        },
        {
          type: "BookComment",
          id: `MY ${isbn}`,
        },
        { type: "BookStats", id: isbn },
      ],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useGetMyCommentQuery,
  useCreateCommentMutation,
  useUpdateMyCommentMutation,
  useDeleteMyCommentMutation,
} = apiWithComments;
