import { configureStore } from "@reduxjs/toolkit";
import { orderAPI } from "./api/OrderAPI";
import { productAPI } from "./api/ProductAPI";
import { userAPI } from "./api/UserAPI";
import { cartReducer } from "./reducers/cartReducers";
import { userReducer } from "./reducers/userReducers";
import { dashboardAPI } from "./api/DashboardAPI";



export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
    reducer: {
        [userAPI.reducerPath]: userAPI.reducer,
        [productAPI.reducerPath]: productAPI.reducer,
        [orderAPI.reducerPath]: orderAPI.reducer,
        [dashboardAPI.reducerPath]: dashboardAPI.reducer,
        [userReducer.name]: userReducer.reducer,
        [cartReducer.name]: cartReducer.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            userAPI.middleware,
            productAPI.middleware,
            orderAPI.middleware,
            dashboardAPI.middleware
        ),
})

export type RootState = ReturnType<typeof store.getState> 