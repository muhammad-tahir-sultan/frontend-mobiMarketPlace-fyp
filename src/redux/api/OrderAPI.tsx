import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllOrdersResponse, MessageResponse, NewOrderRequest, OrderDetailsResponse, UpdateOrderRequest } from "../../types/api-types";


export const orderAPI = createApi({
    reducerPath: "orderApi", baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/order/` }),
    tagTypes: ["orders"],
    endpoints: (builder) => ({
        newOrder: builder.mutation<MessageResponse, NewOrderRequest>({
            query: (data) => ({
                url: `new`,
                method: "POST",
                body: data
            }), invalidatesTags: ["orders"]
        }),
        myOrders: builder.query<AllOrdersResponse, string>({
            query: (id) => `my?id=${id}`, providesTags: ["orders"]
        }),
        allOrders: builder.query<AllOrdersResponse, string>({
            query: (id) => `my?id=${id}`, providesTags: ["orders"]
        }),
        orderDetails: builder.query<OrderDetailsResponse, string>({
            query: (id) => `${id}`, providesTags: ["orders"]
        }),
        updateOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
            query: ({ userId, orderId }) => ({
                url: `${orderId}?id=${userId}`,
                method: "PUT"
            }), invalidatesTags: ["orders"]
        }),
        deleteOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
            query: ({ userId, orderId }) => ({
                url: `${orderId}?id=${userId}`,
                method: "DELETE"
            }), invalidatesTags: ["orders"]
        }),

    })

})


export const { useNewOrderMutation, useAllOrdersQuery, useUpdateOrderMutation, useDeleteOrderMutation, useMyOrdersQuery, useOrderDetailsQuery } = orderAPI