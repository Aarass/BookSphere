import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookClub } from "@interfaces/bookClub";
import { Room } from "@interfaces/room";
import { useNavigate } from "react-router";

export function RoomDisplay({ room, club }: { room: Room; club: BookClub }) {
  const navigate = useNavigate();
  return (
    <Card key={room.id} className="cursor-pointer">
      <button
        style={{ textAlign: "unset" }}
        onClick={() => {
          navigate(`/clubs/${club.id}/rooms/${room.id}`);
        }}
      >
        <CardHeader>
          <CardTitle>{room.tittle}</CardTitle>
          <CardDescription>{room.description}</CardDescription>
        </CardHeader>
      </button>
    </Card>
  );
}
