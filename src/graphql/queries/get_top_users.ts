import { gql } from "@apollo/client";

export const GET_TOP_USERS = gql`
query GetTopUsers($first: Int, $after: String) {
  topUsers(first: $first, after: $after) {
    edges {
      node {
        id
        username
        profilePicture
        fullName
        bio
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
`;
