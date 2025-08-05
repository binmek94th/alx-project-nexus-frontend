import { useQuery } from "@apollo/client";
import { GET_TOP_USERS } from "../../../graphql/queries/get_top_users";

export interface TopUser {
    id: string;
    username: string;
    fullName: string;
    profilePicture: string;
    bio: string;
    postInteractionScore?: number;
}

export const useRecommendedUsers = () => {
    const { data, loading, error, fetchMore } = useQuery(GET_TOP_USERS, {
        variables: { first: 5 },
        notifyOnNetworkStatusChange: true,
    });

    const users: TopUser[] =
        data?.topUsers?.edges?.map((edge: any) => edge.node) ?? [];

    const hasNextPage = data?.topUsers?.pageInfo?.hasNextPage;
    const endCursor = data?.topUsers?.pageInfo?.endCursor;

    const loadMore = () => {
        if (!hasNextPage) return;
        fetchMore({
            variables: {
                after: endCursor,
            },
            updateQuery: (prevResult, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prevResult;
                return {
                    topUsers: {
                        ...fetchMoreResult.topUsers,
                        edges: [
                            ...prevResult.topUsers.edges,
                            ...fetchMoreResult.topUsers.edges,
                        ],
                    },
                };
            },
        });
    };

    return {
        users,
        loading,
        error,
        hasNextPage,
        loadMore,
    };
};
