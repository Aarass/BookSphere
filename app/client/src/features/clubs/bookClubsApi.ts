import { api } from "@/app/store";
import { BookClub, BookClubWithMembershipStatus } from "@interfaces/bookClub";
import { CreateBookClubDto } from "@interfaces/dtos/bookClubDto";
import { Room } from "@interfaces/room";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
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

export function useSendMessage({
  bookClubId,
  roomId,
}: {
  bookClubId: BookClub["id"];
  roomId: Room["id"];
}) {
  const socket = useRef<Socket>(null);

  useEffect(() => {
    socket.current = io("http://localhost:3000", {
      query: {
        bookClubId,
        roomId,
      },
      autoConnect: true,
      withCredentials: true,
    });

    // socket.current.on("connect", () => {
    //   console.log("Connected");
    // });
    //
    // socket.current.on("disconnect", () => {
    //   console.log("Disconnected");
    // });

    return () => {
      socket.current?.disconnect();
    };
  }, [bookClubId, roomId]);

  function sendMessage(message: string) {
    socket.current?.send(message);
    //
    // .send("message", message);
  }

  return sendMessage;
}

export const {
  useGetAllBookClubsQuery,
  useGetBookClubByIdQuery,
  useGetJoinedBookClubsQuery,
  useCreateBookClubMutation,
  useJoinBookClubMutation,
  useLeaveBookClubMutation,
} = apiWithBookClubs;
