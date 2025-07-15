import { Button } from "@/components/ui/button";
import { Outlet, useNavigate } from "react-router";
import { useAppSelector } from "../app/hooks";
import { selectAuthStatus } from "../features/auth/authSlice";

export function MustBeLoggedInGuard() {
  const navigate = useNavigate();
  const status = useAppSelector(selectAuthStatus);

  if (status === "logged_in") {
    return <Outlet />;
  } else if (status === "logged_out") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <p>
          <strong>You must be logged in</strong>
        </p>
        <Button
          onClick={() => {
            navigate("/auth/login");
          }}
        >
          Login
        </Button>
      </div>
    );
  } else {
    return <p>Please wait</p>;
  }
}
