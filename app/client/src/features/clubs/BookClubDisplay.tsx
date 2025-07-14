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
    <Card>
      <CardHeader>
        <CardTitle>{club.tittle}</CardTitle>
        <CardDescription>{club.description}</CardDescription>
        <CardAction>
          <Button
            variant="link"
            onClick={() => {
              navigate(`/clubs/${club.id}`);
            }}
          >
            Open
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
