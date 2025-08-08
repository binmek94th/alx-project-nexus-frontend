import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import {handleError} from "../utils/auth.ts";

export interface Payload<T> {
    results: T[];
    next: string | null;
    previous: string | null;
}

const baseQueryWithErrorHandling: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError | SerializedError
> = async (args, api, extraOptions) => {
    const rawBaseQuery = fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
        prepareHeaders: (headers) => {
            return prepareHeaders(headers)
        }
    });

    const result = await rawBaseQuery(args, api, extraOptions);

    handleError(result)

    return result;
};


export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['Post', 'Comment', 'Story', 'User'],
    endpoints: () => ({}),
});


export const prepareHeaders = (headers: any) => {
    const token = localStorage.getItem('access_token')
    if (token)
        headers.set('Authorization', `Bearer ${token}`);

    return headers;
}
