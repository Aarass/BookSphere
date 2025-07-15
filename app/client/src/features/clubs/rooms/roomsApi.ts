import { api } from "@/app/store";
import { Room } from "@interfaces/room";
import { CreateRoomDto } from "@interfaces/dtos/roomDto";
import { BookClub } from "@interfaces/bookClub";

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
      query: ({ clubId, roomId }) => `/book-clubs/${clubId}/rooms${roomId}`,
    }),
    createRoom: builder.mutation<Room, CreateRoomDto>({
      query: (dto) => ({
        url: `/book-clubs/:id/rooms`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: [{ type: "BookClubRoom", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllRoomsQuery,
  useGetRoomByIdQuery,
  useCreateRoomMutation,
} = apiWithRooms;
