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
    <Card className="relative">
      <button
        className="absolute inset-0 cursor-pointer"
        onClick={() => navigate(`/clubs/${club.id}/rooms/${room.id}`)}
      />
      <CardHeader>
        <CardTitle>{room.tittle}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
