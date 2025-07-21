import { Book } from "@interfaces/book";
import { useGetCommentsQuery } from "./commentsApi";
import { Comment } from "./Comment";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { CreateComment } from "./CreateComment";
import { useGetMeQuery, useGetUserQuery } from "@/features/user/userApi";

export function CommentsList(props: {
  isbn: Book["isbn"];
  createCommentOpen: boolean;
}) {
  const {
    data: comments = [],
    isLoading,
    isFetching,
  } = useGetCommentsQuery(props.isbn);

  const { data: me } = useGetMeQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Collapsible
      open={props.createCommentOpen}
      className="flex flex-col gap-4"
      style={{ opacity: isFetching ? "opacity-50" : "opacity-100" }}
      onOpenChange={(open) => {
        console.log(open);
      }}
    >
      <CollapsibleContent asChild>
        <CreateComment isbn={props.isbn} />
      </CollapsibleContent>

      {comments.map((comment) => {
        if (props.createCommentOpen && me?.id === comment.authorId) {
          return null;
        }

        return (
          <Comment
            key={`${comment.bookISBN}${comment.authorId}`}
            comment={comment}
          />
        );
      })}
    </Collapsible>
  );
}
