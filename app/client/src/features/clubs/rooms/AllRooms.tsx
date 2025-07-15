import { BookClub } from "@interfaces/bookClub";
import { useGetAllRoomsQuery } from "./roomsApi";
import { RoomDisplay } from "./RoomDisplay";

export function AllRooms({ club }: { club: BookClub }) {
  const { data: rooms = [], isLoading } = useGetAllRoomsQuery(club.id);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return rooms.map((room) => (
    <RoomDisplay key={room.id} room={room} club={club} />
  ));
}
