import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  mode: "light" | "dark";
  user: {
    _id: string;
    name: string;
    email: string;
    picturePath: string;
  };
}

const initialState: UserState = {
  mode: "light",
  user: {
    _id: "1",
    name: "Farouk Allani",
    email: "farouk.allani.pro@gmail.com",
    picturePath: "https://avatars.githubusercontent.com/u/46499904?v=4",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { setMode } = userSlice.actions;

export default userSlice.reducer;
