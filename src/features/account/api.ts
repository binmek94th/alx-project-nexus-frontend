import {baseApi} from "../../services/api.ts";

export const api = baseApi.injectEndpoints({
    endpoints: (build) => ({
        updateAccount: build.mutation<void, { body: FormData }>({
            query: ({body}) => ({
                url: `api/user/users/update-account/`,
                method: 'PATCH',
                body: body,
            }),
            invalidatesTags: ['User'],
        }),
        updateEmail: build.mutation<void, { email: string }>({
            query: (body) => ({
                url: 'api/user/users/update-email/',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['User'],
        }),
        updatePassword: build.mutation<void, { new_password: string}>({
            query: ({new_password}) => ({
                url: 'api/user/users/update-password/',
                method: 'PATCH',
                body: {password: new_password},
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useUpdateAccountMutation,
    useUpdateEmailMutation,
    useUpdatePasswordMutation,
} = api;
