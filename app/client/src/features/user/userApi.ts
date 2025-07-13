import { api } from "@/app/store";
import { User } from "@interfaces/user";

export const apiWithUsers = api.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<User | null, User["id"]>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [
        {
          type: "User",
          id: id,
        },
      ],
    }),
  }),
});

export const { useGetUserQuery } = apiWithUsers;
