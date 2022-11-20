import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const personAdapter = createEntityAdapter({
  selectId: (person) => person._id,
});

const initialState = personAdapter.getInitialState();

export const personApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updatePerson: builder.mutation({
      query: (personalData) => ({
        url: process.env.REACT_APP_UPDATE_PERSON,
        method: "POST",
        body: { ...personalData },
      }),
      invalidatesTags: (result, error, arg) => {
        return [{ type: "User", _id: arg._id }];
      },
    }),
  }),
});

export const { useUpdatePersonMutation } = personApiSlice;
