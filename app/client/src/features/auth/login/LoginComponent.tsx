import { useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { login } from "../authSlice";

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
          }),
        );

        if (login.fulfilled.match(result)) {
          navigate("/home");
        }
      })}
    >
      <div className="flex flex-col gap-2">
        <Input {...register("username", { required: true })} />
        {errors.username && <p>Username is required.</p>}
        <Input {...register("password", { required: true })} type="password" />
        {errors.password && <p>Password is required.</p>}
        <Button type="submit">Login</Button>
      </div>
    </form>
  );
}
