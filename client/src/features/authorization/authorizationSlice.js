import { createSlice } from "@reduxjs/toolkit";

const authorizationSlice = createSlice({
  name: "authorization",
  initialState: { token: null, userData: { authorities: 0 } },
  reducers: {
    setToken: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
    },
    setUserData: (state, action) => {
      state.userData = { ...state.userData, ...action.payload };
    },
    logOut: (state, action) => {
      state.token = null;
      state.userData = { authorities: 0 };
    },
  },
});

export const { setToken, logOut, setUserData } = authorizationSlice.actions;

export const selectCurrentToken = (state) => state.authorization.token;
export const selectUserAuthorities = (state) =>
  state.authorization.userData.authorities;

export default authorizationSlice.reducer;
