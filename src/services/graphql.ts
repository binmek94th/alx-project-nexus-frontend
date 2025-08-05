import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
    uri: `${import.meta.env.VITE_API_URL}/graphql`,
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("access");
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "",
        },
    };
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
