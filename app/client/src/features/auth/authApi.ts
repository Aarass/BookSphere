import { backend } from "../../constants";
import type { LoginDto } from "@interfaces/dtos/loginDto";
import type { RegisterDto } from "@interfaces/dtos/registerDto";

export async function createLoginRequest({ username, password }: LoginDto) {
  return fetch(`${backend}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    } satisfies LoginDto),
  });
}

export async function createRegisterRequest({
  username,
  password,
  firstName,
  lastName,
  color,
}: RegisterDto) {
  return fetch(`${backend}/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      firstName,
      lastName,
      color,
    } satisfies RegisterDto),
  });
}

export async function createLogoutRequest() {
  return fetch(`${backend}/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function createRestoreRequest() {
  return fetch(`${backend}/users/me`, {
    method: "GET",
    credentials: "include",
  });
}

// { username: "Aaras", password: "password" }

// await fetch("http://localhost:3000", {
//   credentials: "include",
// });
//
//

// const api = createApi({
//   reducerPath: "api",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://localhost:3000",
//     credentials: "include", // <-----------------------
//   }),
//   endpoints: (builder) => ({
//     // tvoji endpoint-i ovde
//   }),
// });
