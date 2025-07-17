import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookClub, BookClubWithMembershipStatus } from "@interfaces/bookClub";
import { useNavigate } from "react-router";

export function BookClubDisplay({
  club,
}: {
  club: BookClub | BookClubWithMembershipStatus;
}) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-[1fr_min-content] items-center">
      <div>
        <p className="text-xs text-primary opacity-50 mb-1">Jul 17</p>
        <h1 className="font-bold">{club.tittle}</h1>
        <h2 className="text-sm">{club.description}</h2>
        <h3 className="mt-2 text-sm opacity-70">7 rooms</h3>
      </div>

      <Button
        variant="link"
        onClick={() => {
          navigate(`/clubs/${club.id}`);
        }}
      >
        Open
      </Button>
    </div>
  );
}
