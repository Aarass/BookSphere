import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useGetUserQuery } from "@/features/user/userApi";
import { Comment as CommentType } from "@interfaces/comment";

export function Comment({ comment }: { comment: CommentType }) {
  const { data: user } = useGetUserQuery(comment.authorId);

  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 px-4 shadow-sm">
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Avatar>
              <AvatarFallback>{`${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`}</AvatarFallback>
            </Avatar>
            <p>{user.username}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <p>{comment.content}</p>
    </div>
  );
}
