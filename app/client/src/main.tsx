import { Toaster } from "@/components/ui/sonner";
import { Globe } from "lucide-react";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router";
import { store } from "./app/store";
import { ModeToggle } from "./components/ui/custom/themeToggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./components/ui/navigation-menu";
import { ThemeProvider } from "./components/ui/theme-provider";
import { selectIsLoggedIn, tryRestoreSession } from "./features/auth/authSlice";
import { Login } from "./features/auth/login/LoginComponent";
import { Book } from "./features/books/Book";
import { BookList } from "./features/books/BookList";
import { CreateBook } from "./features/books/CreateBook";
import { AllBookClubs } from "./features/clubs/AllBookClubs";
import { JoinedBookClubs } from "./features/clubs/JoinedBookClubs";
import { Room } from "./features/clubs/rooms/Room";
import "./index.css";
import { AuthPage } from "./pages/AuthPage";
import { BookClubPage } from "./pages/BookClubPage";
import { HomePage } from "./pages/HomePage";
import { MustBeLoggedInGuard } from "./routing/Guard";
import { useAppSelector } from "./app/hooks";
import { LandPage } from "./pages/LandPage";

store.dispatch(tryRestoreSession());

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route element={<NavBar />}>
                <Route path="/">
                  <Route index element={<LandPage />} />

                  <Route element={<MustBeLoggedInGuard />}>
                    <Route path="books">
                      <Route index element={<BookList />} />
                      <Route path=":isbn" element={<Book />} />
                      <Route path="create" element={<CreateBook />} />
                    </Route>

                    <Route path="clubs">
                      <Route index element={<AllBookClubs />} />
                      <Route path="joined" element={<JoinedBookClubs />} />
                      <Route path=":id">
                        <Route index element={<BookClubPage />} />
                        <Route path="rooms">
                          <Route index element={<BookClubPage />} />
                          <Route path=":roomId" element={<Room />} />
                        </Route>
                      </Route>
                    </Route>

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
              </Route>
            </Routes>
          </BrowserRouter>

          <Toaster />
        </Provider>
      </ThemeProvider>
    </React.StrictMode>,
  );
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  );
}

function NavBar() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return (
    <div className="h-svh flex flex-col">
      <div className="flex p-2">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to={"/"}>
                  <Globe />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to={"/home"}>Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to={"/books"}>Books</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to={"/clubs"}>Clubs</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="grow"></div>

        {isLoggedIn ? null : (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to={"/auth/login"}>Login</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to={"#"}>Register</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        <div className="ml-10">
          <ModeToggle />
        </div>
      </div>
      <Outlet />
    </div>
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
