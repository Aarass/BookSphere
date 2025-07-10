import { backend } from "../../constants";
import { LoginDto } from "@interfaces/dtos/loginDto";

export async function createLoginRequest(username: string, password: string) {
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
