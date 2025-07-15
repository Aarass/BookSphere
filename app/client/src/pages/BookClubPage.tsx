import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  useGetBookClubByIdQuery,
  useJoinBookClubMutation,
  useLeaveBookClubMutation,
} from "@/features/clubs/bookClubsApi";
import { AllRooms } from "@/features/clubs/rooms/AllRooms";
import { CreateRoomDialog } from "@/features/clubs/rooms/CreateRoom";
import { BookClub } from "@interfaces/bookClub";
import { Loader2Icon, Lock, LogOut, Menu, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";

export function BookClubPage() {
  let { id } = useParams();
  if (!id) throw "Developer error";

  const { data: club, isLoading } = useGetBookClubByIdQuery(id);
  const [join, { isLoading: joining }] = useJoinBookClubMutation();
  const [leave, { isLoading: leaving }] = useLeaveBookClubMutation();

  const [createRoomDialogOpen, setCreateRoomDialogOpen] = useState(false);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!club) {
    return <p>Couldn't fetch information about that club</p>;
  }

  return (
    <div className="w-full h-full grow p-4 flex flex-col gap-4">
      <div className="grid grid-cols-[auto_min-content] ">
        <div>
          <h1 className="text-2xl font-bold">{club.tittle}</h1>
          <p className="text-sm opacity-80">{club.description}</p>
        </div>

        {club.isJoined ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Book Club Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setCreateRoomDialogOpen(true);
                }}
              >
                <PlusIcon />
                Create room
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  leave(club.id);
                }}
                disabled={leaving}
              >
                <LogOut />
                Leave Club
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
      <Separator />
      {club.isJoined ? (
        <>
          <CreateRoomDialog
            club={club}
            open={createRoomDialogOpen}
            setOpen={setCreateRoomDialogOpen}
          />
          <UnlockedContent club={club} />
        </>
      ) : (
        <div className="w-full my-auto flex flex-col justify-center items-center relative gap-6">
          <div className="w-xs">
            <Lock size={100} opacity={0.5} className="mx-auto" />
            <p className="text-sm text-center">
              In order to see book club content
              <br /> you need to join it first
            </p>
          </div>

          <Button
            onClick={() => {
              join(id);
            }}
          >
            {joining ? (
              <>
                <Loader2Icon className="animate-spin" />
                Joining
              </>
            ) : (
              "Join"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

function UnlockedContent({ club }: { club: BookClub }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
      <AllRooms club={club} />
    </div>
  );
}
