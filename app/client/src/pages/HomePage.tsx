import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";

export function HomePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <div>
      <Button
        onClick={() => {
          dispatch(logout());
        }}
      >
        Logout
      </Button>
      <Button
        onClick={() => {
          navigate("/auth/login");
        }}
      >
        Login
      </Button>
    </div>
  );
}
