import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookClub } from "@interfaces/bookClub";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateRoomMutation } from "./roomsApi";

export function CreateRoomDialog({
  club,
  open,
  setOpen,
}: {
  club: BookClub;
  open: boolean;
  setOpen: (_: boolean) => void;
}) {
  const { register, handleSubmit } = useForm();

  const [createRoom, { isLoading: creating, isSuccess }] =
    useCreateRoomMutation();

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
    }
  }, [isSuccess]);

  function create(data: any) {
    const tittle = data["tittle"] as string;
    const description = data["desc"] as string;

    createRoom({
      clubId: club.id,
      dto: { tittle, description },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a room</DialogTitle>
          <DialogDescription>
            Rooms are isolated spaces for chatting about stuff.
          </DialogDescription>
        </DialogHeader>
        <form id="myForm" onSubmit={handleSubmit(create)}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="tittle">Tittle</Label>
              <Input
                id="tittle"
                {...register("tittle", { required: true })}
                placeholder="Tittle"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="desc">Description</Label>
              <Input
                id="desc"
                {...register("desc", { required: true })}
                placeholder="Tell us the purpose of this room"
              />
            </div>
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="myForm">
            {creating ? <Loader2Icon className="animate-spin" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
