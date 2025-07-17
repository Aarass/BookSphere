import { useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { logout } from "@/features/auth/authSlice";
import { CurrentlyReadingBooks } from "@/features/books/CurrentlyReadingBooks";
import { ReadBooks } from "@/features/books/ReadBooks";
import { useGetMeQuery } from "@/features/user/userApi";
import { ChevronRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router";

export function ProfilePage() {
  const { data: me, isLoading } = useGetMeQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!me) {
    return null;
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-4">
      <div className="flex flex-col items-start">
        <div className="grid grid-cols-[max-content_max-content] grid-rows-2 items-center gap-x-4 mx-4">
          <h1 className="text-2xl font-bold text-right">{me.username}</h1>
          <Button
            variant="ghost"
            className="row-span-2 cursor-pointer"
            onClick={async () => {
              const result = await dispatch(logout());
              if (logout.fulfilled.match(result)) {
                navigate("/");
              }
            }}
          >
            <LogOut />
          </Button>
          <h2 className="text-xl opacity-50 text-center">
            {me.firstName} {me.lastName}
          </h2>
        </div>
        <Separator
          style={{ backgroundColor: me.color }}
          className="col-span-2"
        />
        <div className="mt-6 flex w-full flex-col gap-1">
          <h1 className="text-xl font-bold">Currently Reading</h1>
          <CurrentlyReadingBooks userId={me.id} />
        </div>

        <div className="mt-6 flex w-full flex-col gap-1">
          <h1 className="text-xl font-bold">Read</h1>
          <ReadBooks userId={me.id} />
        </div>
      </div>
    </div>
  );
}
