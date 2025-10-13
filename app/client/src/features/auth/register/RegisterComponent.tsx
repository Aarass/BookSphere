import { useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { login, register as registerMe } from "../authSlice";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useMemo } from "react";

// export interface RegisterDto {
//   username: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   color: string;
// }

const colors = [
  "#FF6B6B",
  "#F7B32B",
  "#6BCB77",
  "#4D96FF",
  "#9D4EDD",
  "#FFB5A7",
  "#FFD6A5",
  "#FDFFB6",
  "#CAFFBF",
  "#9BF6FF",
  "#A0C4FF",
  "#BDB2FF",
  "#FFC6FF",
  "#FF8FA3",
  "#FEC868",
  "#00BBF9",
  "#3A86FF",
  "#8338EC",
  "#FB5607",
  "#FF006E",
];

export function Register() {
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
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const result = await dispatch(
          registerMe({
            username: data.username,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            color: randomColor,
          })
        );

        if (!registerMe.fulfilled.match(result)) {
          return;
        }

        navigate("auth/login");
      })}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 mb-2">
          <Label htmlFor="username">Username</Label>
          <Input {...register("username", { required: true })} />
          {errors.username && <p className="text-sm">Username is required.</p>}
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            {...register("password", { required: true })}
            type="password"
          />
          {errors.password && <p className="text-sm">Password is required.</p>}
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <Label htmlFor="firstName">First Name</Label>
          <Input {...register("firstName", { required: true })} />
          {errors.firstName && (
            <p className="text-sm">First Name is required.</p>
          )}
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <Label htmlFor="lastName">Last Name</Label>
          <Input {...register("lastName", { required: true })} />
          {errors.lastName && <p className="text-sm">Last Name is required.</p>}
        </div>

        <Button type="submit">Login</Button>
      </div>
    </form>
  );
}
