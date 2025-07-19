import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookHeart, LucideLoader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGetUserPicksQuery, usePostPicksListMutation } from "./picksApi";
import { User } from "@interfaces/user";
import { useGetMeQuery } from "@/features/user/userApi";

const defaultMode = 1;

export function AddBookToPicks() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(defaultMode);

  const { data: me } = useGetMeQuery();

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setMode(defaultMode);
      }}
    >
      <Tooltip delayDuration={700}>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Toggle pressed={false} className="cursor-pointer">
              <BookHeart />
            </Toggle>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add book to your picks</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="w-[unset]">
        {(() => {
          if (!me) return null;

          if (mode === 1) {
            return <Mode1 userId={me.id} openCreate={() => setMode(2)}></Mode1>;
          } else {
            return <Mode2 done={() => setMode(1)}></Mode2>;
          }
        })()}
      </DialogContent>
    </Dialog>
  );
}

function Mode1({
  userId,
  openCreate,
}: {
  userId: User["id"];
  openCreate: () => void;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="mr-8">Add this book to your picks</DialogTitle>
      </DialogHeader>

      <div className="my-4 flex flex-col gap-4">
        <PicksList userId={userId} />
      </div>
      <DialogFooter>
        <Button type="submit" className="w-full" onClick={openCreate}>
          <Plus />
          Create New Picks List
        </Button>
      </DialogFooter>
    </>
  );
}

function Mode2({ done }: { done: () => void }) {
  const { register, handleSubmit } = useForm();

  const [createPickList, { isLoading: creating }] = usePostPicksListMutation();

  async function create(data: any) {
    const description = data["desc"] as string;

    const { error } = await createPickList({
      description,
      bookIsbns: [],
    });

    if (!error) {
      done();
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="mr-8">New List</DialogTitle>
      </DialogHeader>

      <div className="my-2">
        <form id="myForm" onSubmit={handleSubmit(create)}>
          <Label htmlFor="tittle" className="mb-2">
            Description
          </Label>
          <Input
            id="desc"
            {...register("desc", { required: true })}
            placeholder="Describe the list"
          />
        </form>
      </div>

      <DialogFooter className="flex">
        <DialogClose asChild className="flex-1">
          <Button variant="secondary" onClick={() => {}}>
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          form="myForm"
          onClick={() => {}}
          className="flex-1"
          disabled={creating}
        >
          {creating ? <LucideLoader2 className="animate-spin" /> : null}
          Create
        </Button>
      </DialogFooter>
    </>
  );
}

export function PicksList({ userId }: { userId: User["id"] }) {
  const { data: list = [], isLoading } = useGetUserPicksQuery(userId);

  if (isLoading) {
    return <p className="text-center">Loading</p>;
  }

  if (list.length === 0) {
    return <p className="text-center">You don't have any lists created yet</p>;
  }

  return list.map((item) => (
    <div className="flex items-center gap-3">
      <Checkbox id="asdf" />
      <Label htmlFor="asdf">Accept terms and conditions</Label>
    </div>
  ));

  return null;
}
// pressed={pressed}
// onPressedChange={setPressed}
// className={`cursor-pointer ${pressed ? "bg-secondary" : ""}`}
