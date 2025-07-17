import { api } from "@/app/store";
import { createAppSlice } from "../../app/createAppSlice";
import {
  createLoginRequest,
  createLogoutRequest,
  createRestoreRequest,
} from "./authApi";

const initialState: {
  status: undefined | "logged_in" | "logged_out";
} = {
  status: undefined,
};

export const authSlice = createAppSlice({
  name: "auth",
  initialState,
  reducers: (create) => ({
    tryRestoreSession: create.asyncThunk(
      async () => {
        const res = await createRestoreRequest();

        if (!res.ok) {
          throw new Error(`Couldn't restore session`);
        }
      },
      {
        fulfilled: (state) => {
          state.status = "logged_in";
        },
        rejected: (state) => {
          state.status = "logged_out";
        },
      },
    ),
    login: create.asyncThunk(
      async ({
        username,
        password,
      }: {
        username: string;
        password: string;
      }) => {
        const res = await createLoginRequest(username, password);

        if (!res.ok) {
          throw new Error(`Couldn't log you in`);
        }
      },
      {
        fulfilled: (state) => {
          state.status = "logged_in";
        },
        rejected: (state) => {
          state.status = "logged_out";
        },
      },
    ),
    logout: create.asyncThunk(
      async (_, thunkApi) => {
        const res = await createLogoutRequest();

        if (!res.ok) {
          throw new Error(`Couldn't log you in`);
        }

        thunkApi.dispatch(api.util.resetApiState());
      },
      {
        fulfilled: (state) => {
          state.status = "logged_out";
        },
      },
    ),
  }),
  selectors: {
    selectAuthStatus: (slice) => slice.status,
    selectIsLoggedIn: (slice) => slice.status === "logged_in",
  },
});

export const { login, logout, tryRestoreSession } = authSlice.actions;

export const { selectAuthStatus, selectIsLoggedIn } = authSlice.selectors;

// increment: create.reducer((state) => {
//   // Redux Toolkit allows us to write "mutating" logic in reducers. It
//   // doesn't actually mutate the state because it uses the Immer library,
//   // which detects changes to a "draft state" and produces a brand new
//   // immutable state based off those changes
//   state.value += 1;
// }),
// incrementByAmount: create.reducer(
//   (state, action: PayloadAction<number>) => {
//     state.value += action.payload;
//   },
// ),
