import { Book } from "@interfaces/book";
import { useGetCommentsQuery } from "./commentsApi";
import { Comment } from "./Comment";

export function CommentsList(props: { isbn: Book["isbn"] }) {
  const {
    data: comments = [],
    isLoading,
    isFetching,
  } = useGetCommentsQuery(props.isbn);

  return (
    <div>
      {comments.map((comment) => (
        <Comment
          key={`${comment.bookISBN}${comment.authorId}`}
          comment={comment}
        />
      ))}
    </div>
  );
}
