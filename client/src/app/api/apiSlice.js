import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  setToken,
  logOut,
} from "../../features/authorization/authorizationSlice";

const baseQuery = fetchBaseQuery({
  reducerPath: "/",
  mode: "cors",
  baseUrl: "http://localhost:5000",
  credentials: "include", // httpOnly
  prepareHeaders: (headers, { getState }) => {
    const token = getState().authorization.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
      headers.set("x-xsrf-token", localStorage.getItem("csrf"));
    }
    console.log(headers);
    return headers;
  },
});

const baseQueryReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log(result);

  if (result?.error?.status === 403) {
    console.log("sending refresh token");
    // send refresh token to get new access token
    const refreshResult = await baseQuery(
      process.env.REACT_APP_REFRESH_TOKEN,
      api,
      extraOptions
    );
    console.log(refreshResult);
    if (refreshResult?.data) {
      // const user = api.getState().authotrization.user;
      // store the new token
      api.dispatch(setToken({ ...refreshResult }));
      // retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryReauth,
  tagTypes: [
    "User",
    "Person",
    "Abonements",
    "Orders",
    "BlockedDays",
    "BlockedDates",
    "BasicDaysSchedule",
  ],
  endpoints: (builder) => ({}),
});
