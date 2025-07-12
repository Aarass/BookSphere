import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import { store } from "./app/store";
import "./index.css";
import { AuthPage } from "./pages/AuthPage";
import { MustBeLoggedInGuard } from "./routing/Guard";
import { Login } from "./features/auth/login/LoginComponent";
import { HomePage } from "./pages/HomePage";
import { tryRestoreSession } from "./features/auth/authSlice";
import { CreateBook } from "./features/books/CreateBook";

store.dispatch(tryRestoreSession());

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              {/* <Route index element={<p>landpage</p>} /> */}
              <Route
                index
                element={
                  <div className="flex min-h-svh items-center justify-center">
                    <CreateBook />
                  </div>
                }
              />

              <Route element={<MustBeLoggedInGuard />}>
                <Route path="home" element={<HomePage />} />
                <Route path="profile" element={<p>profile</p>} />
              </Route>

              <Route path="auth">
                <Route element={<AuthPage />}>
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<p>register</p>} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>,
  );
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  );
}

// import { io } from "socket.io-client";
// import { ReadMessagesDto } from "@interfaces/dtos/messageDto";

// let send: (_: string) => void | undefined;
//
// const input = document.createElement("input");
// container?.appendChild(input);
//
// input.onkeydown = (event) => {
//   if (event.key === "Enter") {
//     event.preventDefault();
//
//     if (send) {
//       send(input.value);
//       input.value = "";
//     }
//   }
// };

// (async () => {
//   try {
//     await fetch("http://localhost:3000/login", {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ username: "Aaras", password: "password" }),
//     });
//
//     await fetch("http://localhost:3000", {
//       credentials: "include",
//     });
//   } catch (err) {
//     console.error("Fail with auth", err);
//     return;
//   }
//
//   let tmp: ReadMessagesDto = {
//     beforeTimestamp: Date.now(),
//     limit: 5,
//   };
//
//   let messages = await fetch(
//     "http://localhost:3000/book-clubs/a19e0525-f1a5-4fa0-9009-0aa7865d22cd/rooms/c32f8182-ec9b-4b76-a936-05a6ddbf4937/messages",
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//       body: JSON.stringify(tmp),
//     }
//   );
//
//   console.log(await messages.json());
//
//   const socket = io("http://localhost:3000", {
//     query: {
//       bookClubId: "a19e0525-f1a5-4fa0-9009-0aa7865d22cd",
//       roomId: "c32f8182-ec9b-4b76-a936-05a6ddbf4937",
//     },
//     autoConnect: true,
//     withCredentials: true,
//   });
//
//   send = (message: string) => {
//     socket.send(message);
//   };
//
//   socket.on("message", async (data) => {
//     console.log(data);
//   });
//
//   socket.on("connect", async () => {
//     console.log("Connected");
//   });
//
//   socket.on("disconnect", () => {
//     console.log("Disconnected");
//   });
// })();
