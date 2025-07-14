import { api } from "@/app/store";
import { User } from "@interfaces/user";

export const apiWithUsers = api.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<User | null, User["id"]>({
      query: (id) => `/users/${id}`,
      providesTags: (result, _error, id) =>
        result
          ? [
              {
                type: "User",
                id: id,
              },
            ]
          : [],
    }),
    getMe: builder.query<User | null, void>({
      query: () => `/users/me`,
      providesTags: (result, _error, _id) =>
        result
          ? [
              {
                type: "User",
                id: result.id,
              },
            ]
          : [],
    }),
  }),
});

export const { useGetUserQuery, useGetMeQuery } = apiWithUsers;
