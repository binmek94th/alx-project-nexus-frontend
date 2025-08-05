import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../services/api";
import {authApi} from "../features/auth/api.ts";


export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware: any) =>
        getDefaultMiddleware().concat(baseApi.middleware).concat(authApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;