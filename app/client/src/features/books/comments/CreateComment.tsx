import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Book } from "@interfaces/book";
import { CreateCommentDto, UpdateCommentDto } from "@interfaces/dtos/bookDto";
import { Loader2Icon, Send, SquarePen, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useCreateCommentMutation,
  useDeleteMyCommentMutation,
  useGetMyCommentQuery,
  useUpdateMyCommentMutation,
} from "./commentsApi";
import { RateBook } from "../rating/RateBook";

export function CreateComment(props: { isbn: Book["isbn"] }) {
  const [input, setInput] = useState("");

  const { data: myComment, isLoading } = useGetMyCommentQuery(props.isbn);

  useEffect(() => {
    if (myComment) {
      setInput(myComment.content);
    } else if (myComment === null) {
      setInput("");
    }
  }, [myComment]);

  const [createComment, { isLoading: creating }] = useCreateCommentMutation();
  const [updateComment, { isLoading: updating }] = useUpdateMyCommentMutation();
  const [deleteComment, { isLoading: deleting }] = useDeleteMyCommentMutation();

  const performingOperation = creating || updating || deleting;

  const isEditing = myComment ? myComment.content !== input : false;
  const canDelete = myComment && !isEditing;

  function post() {
    createComment({
      isbn: props.isbn,
      dto: {
        content: input,
      } satisfies CreateCommentDto,
    });
  }
  function update() {
    console.log(input);

    updateComment({
      isbn: props.isbn,
      dto: {
        content: input,
      } satisfies UpdateCommentDto,
    });
  }
  function del() {
    deleteComment({
      isbn: props.isbn,
    });
  }

  return (
    <div className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 px-4 shadow-sm">
      {(() => {
        if (isLoading) {
          return <p>Loading...</p>;
        }

        return (
          <>
            <div className="grid w-full gap-3">
              <Label htmlFor="message">Leave your review</Label>
              <Textarea
                placeholder="Start typing your review."
                id="message"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
              />
            </div>

            <div className="flex w-full justify-end gap-2">
              {creating ? (
                <Button size="sm" disabled>
                  <Loader2Icon className="animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={
                    myComment !== null ||
                    performingOperation ||
                    input.length === 0
                  }
                  onClick={post}
                >
                  <Send />
                  Post
                </Button>
              )}

              {updating ? (
                <Button size="sm" disabled>
                  <Loader2Icon className="animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!isEditing || performingOperation}
                  onClick={update}
                >
                  <SquarePen />
                  Update
                </Button>
              )}

              {deleting ? (
                <Button size="sm" disabled>
                  <Loader2Icon className="animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={!canDelete || performingOperation}
                  onClick={del}
                >
                  <Trash />
                  Delete
                </Button>
              )}
            </div>
          </>
        );
      })()}
    </div>
  );
}
