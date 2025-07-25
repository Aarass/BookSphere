import { api, store } from "@/app/store";
import { apiWithUsers } from "@/features/user/userApi";
import { Book } from "@interfaces/book";
import {
  AddBookToListDto,
  RemoveBookFromListDto,
  UserRecommendationListDto,
} from "@interfaces/dtos/userRecommendationList";
import {
  RecommendationList,
  RecommendationListWithBooks,
} from "@interfaces/recommendationList";
import { User } from "@interfaces/user";
import { toast } from "sonner";

export const apiWithPicks = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserPicksLists: builder.query<
      RecommendationListWithBooks[],
      { userId: User["id"]; isMe: boolean }
    >({
      query: ({ userId }) => `users/${userId}/recommendations`,
      providesTags: (_result, _error, { userId, isMe }) => {
        return [
          {
            type: "UserPicks",
            id: `${isMe ? "my" : userId}`,
          },
        ];
      },
    }),
    createPicksList: builder.mutation<
      UserRecommendationListDto,
      { description: string }
    >({
      query: (dto) => ({
        url: `/users/me/recommendations`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: [{ type: "UserPicks", id: `my` }],
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          toast("Successfully created a recommendation list");
        } catch {
          toast(
            "There was an error while trying to create a recommendation list",
          );
        }
      },
    }),
    // updateMyComment: builder.mutation<
    //   void,
    //   { isbn: Book["isbn"]; dto: UpdateCommentDto }
    // >({
    //   query: ({ isbn, dto }) => ({
    //     url: `/books/${isbn}/comments/my`,
    //     method: "PUT",
    //     body: dto,
    //     responseHandler: "text",
    //   }),
    //   onQueryStarted: async (_, { queryFulfilled }) => {
    //     try {
    //       await queryFulfilled;
    //       toast("Successfully updated the comment");
    //     } catch {
    //       toast("There was an error while trying to update a comment");
    //     }
    //   },
    //   invalidatesTags: (_result, _error, { isbn }) => [
    //     {
    //       type: "BookComment",
    //       id: `LIST ${isbn}`,
    //     },
    //     {
    //       type: "BookComment",
    //       id: `MY ${isbn}`,
    //     },
    //   ],
    // }),
    deletePicksList: builder.mutation<void, RecommendationList["_id"]>({
      query: (listId) => ({
        url: `/users/me/recommendations/${listId}`,
        method: "DELETE",
        responseHandler: "text",
      }),
      invalidatesTags: [{ type: "UserPicks", id: `my` }],
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          toast("Successfully deleted a recommendation list");
        } catch {
          toast(
            "There was an error while trying to delete a recommendation list",
          );
        }
      },
    }),
    addToPicksList: builder.mutation<
      void,
      { listId: string; isbn: Book["isbn"] }
    >({
      query: ({ listId, isbn }) => ({
        url: `/users/me/recommendations/${listId}/books`,
        method: "POST",
        body: { isbn } satisfies AddBookToListDto,
        responseHandler: "text",
      }),
      invalidatesTags: [{ type: "UserPicks", id: `my` }],
    }),
    removeFromPicksList: builder.mutation<
      void,
      { listId: string; isbn: Book["isbn"] }
    >({
      query: ({ listId, isbn }) => ({
        url: `/users/me/recommendations/${listId}/books`,
        method: "DELETE",
        body: { isbn } satisfies RemoveBookFromListDto,
        responseHandler: "text",
      }),
      invalidatesTags: [{ type: "UserPicks", id: `my` }],
    }),
  }),
});

export const {
  useGetUserPicksListsQuery,
  useCreatePicksListMutation,
  useDeletePicksListMutation,
  useAddToPicksListMutation,
  useRemoveFromPicksListMutation,
} = apiWithPicks;
