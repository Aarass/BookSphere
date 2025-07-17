import { useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { logout } from "@/features/auth/authSlice";
import { CurrentlyReadingBooks } from "@/features/books/CurrentlyReadingBooks";
import { ReadBooks } from "@/features/books/ReadBooks";
import { useGetMeQuery } from "@/features/user/userApi";
import { useMyColor } from "@/utils/colors";
import { ChevronRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router";

export function ProfilePage() {
  const { data: me, isLoading } = useGetMeQuery();
  const myClr = useMyColor();
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
      <div className="flex flex-col items-end">
        <div className="grid grid-cols-[max-content_max-content] grid-rows-2 items-center py-2">
          <h1 className="text-2xl font-bold text-right m-0">{me.username}</h1>
          <Button
            style={{ backgroundColor: myClr }}
            className="row-span-2 cursor-pointer h-full m-2"
            onClick={async () => {
              const result = await dispatch(logout());
              if (logout.fulfilled.match(result)) {
                navigate("/");
              }
            }}
          >
            <LogOut className="text-foreground" />
          </Button>
          <h2 className="text-xl opacity-50 text-center m-0">
            {me.firstName} {me.lastName}
          </h2>
        </div>
        <Separator style={{ backgroundColor: myClr }} className="col-span-2" />
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
