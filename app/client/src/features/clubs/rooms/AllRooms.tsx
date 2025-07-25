import { BookClub } from "@interfaces/bookClub";
import { useGetAllRoomsQuery } from "./roomsApi";
import { RoomDisplay } from "./RoomDisplay";
import { Separator } from "@/components/ui/separator";

export function AllRooms({ club }: { club: BookClub }) {
  const { data: rooms = [], isLoading } = useGetAllRoomsQuery(club.id);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Separator />
      {rooms.map((room) => (
        <div key={room.id}>
          <RoomDisplay room={room} club={club} />
          <Separator />
        </div>
      ))}
    </>
  );
}
