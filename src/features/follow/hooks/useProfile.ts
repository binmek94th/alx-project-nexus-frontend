import { useQuery } from "@apollo/client";
import {GET_PROFILE} from "../../../graphql/queries/get_profile.ts";

export interface Profile {
    username: string;
    id: string;
    fullName: string;
    bio: string;
    profilePicture: string;
    followersCount: number;
    followingCount: number;
    postCount: number;
}

export const useProfile = (id: string) => {
    const { data, loading, error } = useQuery(GET_PROFILE, {
        variables: { id },
        skip: !id,
    });

    const profile = data?.user

    return {
        profile,
        loading,
        error,
    };
};