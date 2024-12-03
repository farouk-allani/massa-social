import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slices/accountSlice";
import userReducer from "./slices/userSlice";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  account: accountReducer,
  user: userReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
