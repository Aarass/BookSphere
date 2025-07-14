import { api } from "@/app/store";
import { Book, ReadingStatus } from "@interfaces/book";
import { BookClub, BookClubWithMembershipStatus } from "@interfaces/bookClub";
import { CreateBookClubDto } from "@interfaces/dtos/bookClubDto";
import { toast } from "sonner";

export const apiWithBookClubs = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllBookClubs: builder.query<BookClubWithMembershipStatus[], void>({
      query: () => `/book-clubs`,
      providesTags: () => {
        return [{ type: "BookClub", id: "LIST" }];
      },
    }),
    getJoinedBookClubs: builder.query<BookClub[], void>({
      query: () => `/book-clubs/joined`,
      providesTags: () => {
        return [{ type: "BookClub", id: "JOINED" }];
      },
    }),
    getBookClubById: builder.query<
      BookClubWithMembershipStatus | null,
      BookClubWithMembershipStatus["id"]
    >({
      query: (id) => `/book-clubs/${id}`,
      providesTags: (_result, _error, id) => {
        return [{ type: "BookClub", id }];
      },
    }),
    createBookClub: builder.mutation<BookClub, CreateBookClubDto>({
      query: (dto) => ({
        url: `/book-clubs`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: [{ type: "BookClub", id: "LIST" }],

      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          toast("Successfully created a book club");
        } catch {
          toast("There was an error while trying to create a book club");
        }
      },
    }),
    joinBookClub: builder.mutation<void, BookClub["id"]>({
      query: (id) => ({
        url: `/book-clubs/${id}/join`,
        method: "POST",
        responseHandler: "text",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "BookClub", id: "JOINED" },
        { type: "BookClub", id },
      ],
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          toast("Successfully joined the book club");
        } catch (err) {
          console.log(err);
          toast("There was an error while trying to join a book club");
        }
      },
    }),
    leaveBookClub: builder.mutation<void, BookClub["id"]>({
      query: (id) => ({
        url: `/book-clubs/${id}/leave`,
        method: "POST",
        responseHandler: "text",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "BookClub", id: "JOINED" },
        { type: "BookClub", id },
      ],
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          toast("Successfully left the book club");
        } catch {
          toast("There was an error while trying to left a book club");
        }
      },
    }),
  }),
});

export const {
  useGetAllBookClubsQuery,
  useGetBookClubByIdQuery,
  useGetJoinedBookClubsQuery,
  useCreateBookClubMutation,
  useJoinBookClubMutation,
  useLeaveBookClubMutation,
} = apiWithBookClubs;
