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
import { LeaderboardsPage } from "./pages/LeaderboardsPage";
import { ProfilePage } from "./pages/ProfilePage";

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

                    <Route path="leaderboards">
                      <Route index element={<LeaderboardsPage />} />
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
                    <Route path="profile" element={<ProfilePage />} />
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
                <Link to={"/leaderboards"}>Leaderboards</Link>
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

        {isLoggedIn ? (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to={"/profile"}>Profile</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        ) : (
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
