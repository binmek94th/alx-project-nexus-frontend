export interface AuthState {
    access: string;
    refresh: string;
}

export interface User {
    email: string | null;
    username: string | null;
    full_name: string | null;
    bio?: string | null;
    profile_picture?: string | null;
}

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL}` || 'http://localhost:8000/api/',
    }),
    endpoints: (builder) => ({
        login: builder.mutation<
            AuthState,
            { username: string; password: string }
        >({
            query: (credentials) => ({
                url: "token/",
                method: "POST",
                body: credentials,
            }),
        }),

        register: builder.mutation<
            User,
            User
        >({
            query: (body) => ({
                url: "user/users/",
                method: "POST",
                body,
            }),
        }),

        resendEmail: builder.mutation<
            { detail: string },
            { email: string }
        >({
            query: (body) => ({
                url: "user/resend_email_verification_email/",
                method: "POST",
                body,
            }),
        }),

        verifyEmail: builder.mutation<{ message: string }, { uid: string; token: string }>({
            query: ({ uid, token }) => ({
                url: `user/verify_email/?uid=${encodeURIComponent(uid)}&token=${encodeURIComponent(token)}`,
                method: "POST",
            }),
        }),

        resetPassword: builder.mutation<{ message: string }, {email: string}>({
            query: (body) => ({
                url: "user/password-reset-link/",
                method: "POST",
                body
            })
        }),

        checkPasswordResetLink: builder.query<{ message: string }, { uid: string; token: string }>({
            query: ({ uid, token }) => ({
                url: `user/verify-password-reset-link/`,
                method: 'GET',
                params: { uid, token },
            }),
        }),
        changePassword: builder.mutation<{ message: string }, { uid: string; token: string; password: string }>({
            query: ({ uid, token, password }) => ({
                url: `user/change-password-reset/`,
                method: "POST",
                body: { uid, token, password },
            }),
        }),
    }),

});

export const {
    useLoginMutation,
    useRegisterMutation,
    useResendEmailMutation,
    useVerifyEmailMutation,
    useResetPasswordMutation,
    useCheckPasswordResetLinkQuery,
    useChangePasswordMutation,
} = authApi;