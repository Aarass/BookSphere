import { useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { logout } from "@/features/auth/authSlice";
import { CurrentlyReadingBooks } from "@/features/books/CurrentlyReadingBooks";
import { ReadBooks } from "@/features/books/ReadBooks";
import { UserPicks } from "@/features/books/picks/UserPicks";
import { useGetMeQuery } from "@/features/user/userApi";
import { useMyColor } from "@/utils/colors";
import { LogOut } from "lucide-react";
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
    <div className="flex-1 flex flex-col items-end justify-center m-auto">
      <div className="flex pb-2">
        <span>
          <h1 className="text-2xl font-bold text-right m-0">{me.username}</h1>
          <h2 className="text-xl opacity-50 text-center m-0">
            {me.firstName} {me.lastName}
          </h2>
        </span>
        <Button
          style={{ backgroundColor: myClr }}
          className="row-span-2 cursor-pointer h-full ml-2"
          onClick={async () => {
            const result = await dispatch(logout());
            if (logout.fulfilled.match(result)) {
              navigate("/");
            }
          }}
        >
          <LogOut className="text-foreground" />
        </Button>
      </div>
      <Separator style={{ backgroundColor: myClr }} className="col-span-2" />
      <div className="flex gap-2 mt-5">
        <div className="flex flex-col w-xs">
          <div>
            <h1 className="mb-1 text-xl font-bold">Currently Reading</h1>
            <div>
              <CurrentlyReadingBooks userId={me.id} />
            </div>
          </div>

          <div>
            <h1 className="mb-2 text-xl font-bold">Read</h1>
            <div>
              <ReadBooks userId={me.id} />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="grow basis-0 overflow-hidden flex gap-2">
            <UserPicks userId={me.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
