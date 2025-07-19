import { api } from "@/app/store";
import { Book } from "@interfaces/book";
import { UserRecommendationListDto } from "@interfaces/dtos/userRecommendationList";
import {
  RecommendationList,
  RecommendationListWithBooks,
} from "@interfaces/recommendationList";
import { User } from "@interfaces/user";
import { toast } from "sonner";

export const apiWithPicks = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserPicks: builder.query<RecommendationListWithBooks[], User["id"]>({
      query: (userId) => `users/${userId}/recommendations`,
      providesTags: (_result, _error, userId) => [
        {
          type: "UserPicks",
          id: `${userId}`,
        },
      ],
    }),
    postPicksList: builder.mutation<
      UserRecommendationListDto,
      { description: string; bookIsbns: Book["isbn"][] }
    >({
      query: (dto) => ({
        url: `/users/me/recommendations`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: (result) =>
        !result
          ? []
          : [
              {
                type: "UserPicks",
                id: `${result.neo4jUserId}`,
              },
            ],
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
    deletePicksList: builder.mutation<
      void,
      { userId: User["id"]; listId: RecommendationList["_id"] }
    >({
      query: ({ listId }) => ({
        url: `/users/me/recommendations/${listId}`,
        method: "DELETE",
        responseHandler: "text",
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        {
          type: "UserPicks",
          id: `${userId}`,
        },
      ],
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
  }),
});

export const {
  useGetUserPicksQuery,
  usePostPicksListMutation,
  useDeletePicksListMutation,
} = apiWithPicks;
