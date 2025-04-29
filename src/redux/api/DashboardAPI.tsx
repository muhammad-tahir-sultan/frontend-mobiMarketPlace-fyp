import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BarResponse, LineResponse, PieResponse, StateResponse } from "../../types/api-types";


export const dashboardAPI = createApi({
    reducerPath: "dashboardApi", baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/dashboard/` }), endpoints: (builder) => ({
        stats: builder.query<StateResponse, string>({
            query: (id) => `stats?id=${id}`,
            keepUnusedDataFor: 0
        }),
        pie: builder.query<PieResponse, string>({
            query: (id) => `pie?id=${id}`,
            keepUnusedDataFor: 0
        }),
        bar: builder.query<BarResponse, string>({
            query: (id) => `bar?id=${id}`,
            keepUnusedDataFor: 0
        }),
        line: builder.query<LineResponse, string>({
            query: (id) => `line?id=${id}`,
            keepUnusedDataFor: 0
        }),


    })

})


export const { useBarQuery, useLineQuery, usePieQuery, useStatsQuery } = dashboardAPI