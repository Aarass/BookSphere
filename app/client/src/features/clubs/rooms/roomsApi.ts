import { api } from "@/app/store";
import { backend } from "@/constants";
import { BookClub } from "@interfaces/bookClub";
import { ReadMessagesDto } from "@interfaces/dtos/messageDto";
import { CreateRoomDto } from "@interfaces/dtos/roomDto";
import { Message } from "@interfaces/message";
import { Room } from "@interfaces/room";
import { io } from "socket.io-client";

export const apiWithRooms = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllRooms: builder.query<Room[], BookClub["id"]>({
      query: (clubId) => `/book-clubs/${clubId}/rooms`,
      providesTags: () => {
        return [{ type: "BookClubRoom", id: "LIST" }];
      },
    }),
    getRoomById: builder.query<
      Room | null,
      { clubId: BookClub["id"]; roomId: Room["id"] }
    >({
      query: ({ clubId, roomId }) => `/book-clubs/${clubId}/rooms/${roomId}`,
    }),
    createRoom: builder.mutation<
      Room,
      { clubId: BookClub["id"]; dto: CreateRoomDto }
    >({
      query: ({ clubId, dto }) => ({
        url: `/book-clubs/${clubId}/rooms`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: [{ type: "BookClubRoom", id: "LIST" }],
    }),
    getMessages: builder.query<
      Message[],
      { clubId: BookClub["id"]; roomId: Room["id"]; dto: ReadMessagesDto }
    >({
      query: ({ clubId, roomId, dto }) => ({
        url: `/book-clubs/${clubId}/rooms/${roomId}/messages`,
        method: "POST",
        body: dto,
      }),
      async onCacheEntryAdded(
        { clubId: bookClubId, roomId },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const socket = io(backend, {
          query: {
            bookClubId,
            roomId,
          },
          autoConnect: true,
          withCredentials: true,
        });
        try {
          await cacheDataLoaded;

          socket.on("message", async (data) => {
            console.log(data);

            updateCachedData((draft) => {
              draft.unshift(data);
            });
          });
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved;
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        socket.disconnect();
      },
    }),
  }),
});

export const {
  useGetAllRoomsQuery,
  useGetRoomByIdQuery,
  useCreateRoomMutation,
  useGetMessagesQuery,
} = apiWithRooms;
