import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { useGetMeQuery } from "@/features/user/userApi";
import { Book } from "@interfaces/book";
import { User } from "@interfaces/user";
import { BookHeart, LucideLoader2, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useAddToPicksListMutation,
  useCreatePicksListMutation,
  useDeletePicksListMutation,
  useGetUserPicksListsQuery,
  useRemoveFromPicksListMutation,
} from "./picksApi";

const defaultMode = 1;

export function AddBookToPicks({ isbn }: { isbn: Book["isbn"] }) {
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
            return (
              <Mode1
                userId={me.id}
                isbn={isbn}
                openCreate={() => setMode(2)}
              ></Mode1>
            );
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
  isbn,
  openCreate,
}: {
  userId: User["id"];
  isbn: Book["isbn"];
  openCreate: () => void;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="mr-8">Add this book to your picks</DialogTitle>
      </DialogHeader>

      <div className="my-4 flex flex-col gap-4">
        <PicksList userId={userId} isbn={isbn} />
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

  const [createPickList, { isLoading: creating }] =
    useCreatePicksListMutation();

  async function create(data: any) {
    const description = data["desc"] as string;

    const { error } = await createPickList({ description });

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

function PicksList({
  userId,
  isbn,
}: {
  userId: User["id"];
  isbn: Book["isbn"];
}) {
  const {
    data: lists = [],
    isLoading,
    isFetching,
  } = useGetUserPicksListsQuery({ userId, isMe: true });

  const [addToList, { isLoading: adding }] = useAddToPicksListMutation();
  const [removeFromList, { isLoading: removing }] =
    useRemoveFromPicksListMutation();
  const [deleteList, { isLoading: deleting }] = useDeletePicksListMutation();

  if (isLoading) {
    return <p className="text-center">Loading</p>;
  }

  if (lists.length === 0) {
    return <p className="text-center">You don't have any lists created yet</p>;
  }

  return lists.map((list) => (
    <div className="flex items-center gap-3 max-w-3xs" key={list._id}>
      <Checkbox
        id={list._id}
        defaultChecked={list.books.map((b) => b.isbn).includes(isbn)}
        disabled={adding || removing || deleting || isFetching}
        onCheckedChange={(newValue) => {
          if (newValue == true) {
            addToList({ listId: list._id, isbn });
          } else {
            removeFromList({ listId: list._id, isbn });
          }
        }}
      />
      <Label htmlFor={list._id} className="text-wrap">
        {list.description}
      </Label>
      <AlertDialog>
        <AlertDialogTrigger className="ml-auto" asChild>
          <Button size="sm" variant="ghost" className="ml-auto cursor-pointer">
            <Trash />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteList(list._id);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  ));
}
