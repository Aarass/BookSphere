import { backend } from "@/constants";
import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authSlice } from "../features/auth/authSlice";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: backend, credentials: "include" }),
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "Book",
    "BookStats",
    "MyBookRating",
    "BookComment",
    "BookReadingStatus",
  ],
});

const rootReducer = combineSlices(authSlice, api);
export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(api.middleware);
    },
    preloadedState,
  });
  setupListeners(store.dispatch);
  return store;
};

export const store = makeStore();

export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
