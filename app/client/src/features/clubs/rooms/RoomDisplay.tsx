import { BookClub } from "@interfaces/bookClub";
import { Room } from "@interfaces/room";
import { CircleChevronRight } from "lucide-react";
import { useNavigate } from "react-router";

export function RoomDisplay({ room, club }: { room: Room; club: BookClub }) {
  const navigate = useNavigate();

  return (
    <div className="relative px-4 py-2 flex justify-between items-center">
      <div>
        <h1 className="font-bold">{room.tittle}</h1>
        <h2 className="text-sm opacity-50">{room.description}</h2>
      </div>
      <CircleChevronRight size={16} />
      <button
        className="absolute inset-0 cursor-pointer"
        onClick={() => navigate(`/clubs/${club.id}/${room.id}`)}
      />
    </div>
  );
}
