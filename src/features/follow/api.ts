import { baseApi } from "../../services/api.ts";

export const userApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        followUser: build.mutation<void, string>({
            query: (id) => ({
                url: 'api/user/followings/',
                method: 'POST',
                body: { following: id },
            }),
        }),
    }),
});

export const { useFollowUserMutation } = userApi;
