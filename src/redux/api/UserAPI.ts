import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { AllUsersMessageResponse, DeleteUserRequest, MessageResponse, UserResponse } from "../../types/api-types";
import { User } from "../../types/types";

export const userAPI = createApi({
    reducerPath: "userApi", baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/user/` }),
    tagTypes: ["users"],
    endpoints: (builder) => ({
        login: builder.mutation<MessageResponse, User>({
            query: (user) => ({
                url: "new",
                method: "POST",
                body: user
            }),
            invalidatesTags: ["users"]
        }),
        deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
            query: ({ userId, adminId }) => ({
                url: `${userId}?id=${adminId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["users"]
        }),
        allUsers: builder.query<AllUsersMessageResponse, string>({
            query: (id) => `all?id=${id}`,
            providesTags: ["users"]
        })
    })

})


export const getUser = async (id: string) => {
    try {
        const { data }: { data: UserResponse } = await axios.get(`${import.meta.env.VITE_SERVER}/user/${id}`)

        return data;

    } catch (error) {
        throw error;
    }
}

export const { useLoginMutation, useAllUsersQuery, useDeleteUserMutation } = userAPI