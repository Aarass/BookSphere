import { useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { login } from "../authSlice";
import { Label } from "@/components/ui/label";

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const result = await dispatch(
          login({
            username: data.username,
            password: data.password,
          })
        );

        if (login.fulfilled.match(result)) {
          navigate("/home");
        }
      })}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 mb-2">
          <Label htmlFor="username">Username</Label>
          <Input {...register("username", { required: true })} />
          {errors.username && <p className="text-sm">Username is required.</p>}
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <Label htmlFor="username">Password</Label>
          <Input
            {...register("password", { required: true })}
            type="password"
          />
          {errors.password && <p className="text-sm">Password is required.</p>}
        </div>

        <Button type="submit">Login</Button>
      </div>
    </form>
  );
}
