import { Outlet } from "react-router";
import { useAppSelector } from "../app/hooks";
import { selectIsLoggedIn } from "../features/auth/authSlice";

export function AuthPage() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Outlet />
      </div>
    );
  } else {
    // TODO
    return <p>Already logged in</p>;
  }
}
