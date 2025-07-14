import { api } from "@/app/store";
import { Room } from "@interfaces/room";
import { CreateRoomDto } from "@interfaces/dtos/roomDto";

export const apiWithRooms = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllRooms: builder.query<Room[], void>({
      query: () => `/book-clubs/:id/rooms`,
      providesTags: () => {
        return [{ type: "BookClubRoom", id: "LIST" }];
      },
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

export const {} = apiWithRooms;
