import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
const ordersAdapter = createEntityAdapter({
  selectId: (order) => order._id,
  sortComparer: (a, b) => a.date_of_game - b.date_of_game,
});

const initialState = ordersAdapter.getInitialState();

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserOrders: builder.query({
      query: () => process.env.REACT_APP_READ_ORDERS,
      transformResponse: (responseData) =>
        ordersAdapter.setAll(initialState, responseData),
      providesTags: (result, error, arg) => [
        { type: "Orders", id: "LIST" },
        ...result.ids.map((_id) => ({ type: "Orders", _id })),
      ],
    }),
    getAllOrders: builder.query({
      query: () => process.env.REACT_APP_READ_ALL_ORDERS,
      transformResponse: (responseData) =>
        ordersAdapter.setAll(initialState, responseData),
      providesTags: (result, error, arg) => [
        { type: "Orders", id: "LIST" },
        ...result.ids.map((_id) => ({ type: "Orders", _id })),
      ],
    }),
    addOrders: builder.mutation({
      query: (order) => ({
        url: process.env.REACT_APP_CREATE_ORDERS,
        method: "POST",
        body: { ...order },
      }),
      invalidatesTags: (result, error, arg) => {
        return [{ type: "User", _id: arg._id }];
      },
    }),
    deleteOrder: builder.mutation({
      query: (order) => ({
        url: process.env.REACT_APP_DELETE_ORDER,
        method: "POST",
        body: { ...order },
      }),
      invalidatesTags: (result, error, arg) => {
        return [{ type: "User", _id: arg._id }];
      },
    }),
  }),
});

export const {
  useGetUserOrdersQuery,
  useGetAllOrdersQuery,
  useDeleteOrderMutation,
  useAddOrdersMutation,
} = ordersApiSlice;

export const selectAllOrdersResult =
  ordersApiSlice.endpoints.getAllOrders.select();

const selectAllOrdersData = createSelector(
  selectAllOrdersResult,
  (orders) => orders.data
);

export const { selectAll: selectAllOrders } = ordersAdapter.getSelectors(
  (state) => selectAllOrdersData(state) ?? initialState
);
