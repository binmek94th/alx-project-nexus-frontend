import {baseApi, type Payload} from "../../services/api.ts";

export interface User {
    id: string;
    email?: string;
    username: string;
    full_name: string;
}

export interface Follow {
    id: string;
    user_id: string;
    username: string;
    full_name: string;
    profile_picture: string;
}

export const userApi = baseApi.injectEndpoints({

    endpoints: (build) => ({
        getUser: build.query<User, void>({
            query: () => `api/user/users/current_user`,
        }),

        getFollowers: build.query<Payload<Follow>, string | void>({
            query: (id?) => {
                if (id) {
                    return `api/user/followers?user_id=${id}`;
                }
                return `api/user/followers`;
            }
        }),
        getFollowings: build.query<Payload<Follow>, string | void>({
            query: (id?) => {
                if (id) {
                    return `api/user/followings?user_id=${id}`;
                }
                return `api/user/followings`;
            }
        })

    }),
});

export const {
    useLazyGetUserQuery,
    useGetFollowersQuery,
    useGetFollowingsQuery,
} = userApi;
