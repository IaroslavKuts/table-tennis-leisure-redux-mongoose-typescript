import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
const ordersAdapter = createEntityAdapter({
  selectId: (order) => order.order_id,
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
        ...result.ids.map((id) => ({ type: "Orders", id })),
      ],
    }),
    getAllOrders: builder.query({
      query: () => process.env.REACT_APP_READ_ALL_ORDERS,
      transformResponse: (responseData) =>
        ordersAdapter.setAll(initialState, responseData),
      providesTags: (result, error, arg) => [
        { type: "Orders", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Orders", id })),
      ],
    }),
    addOrder: builder.mutation({
      query: (order) => ({
        url: "addOrder",
        method: "POST",
        body: { ...order },
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    deleteOrder: builder.mutation({
      query: (order) => ({
        url: process.env.REACT_APP_DELETE_ORDER,
        method: "POST",
        body: { ...order },
      }),
      invalidatesTags: (result, error, arg) => {
        return [{ type: "Orders", id: arg.order_id }];
      },
    }),
  }),
});

export const {
  useGetUserOrdersQuery,
  useGetAllOrdersQuery,
  useDeleteOrderMutation,
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
