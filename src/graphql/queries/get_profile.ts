import { gql } from "@apollo/client";

export const GET_PROFILE = gql`
  query User($id: ID!) {
    user(id: $id) {
      username
      id
      fullName
      bio
      profilePicture
      followersCount
      followingCount
      postCount
      posts {
        id
        caption
        createdAt
        likeCount
        commentCount
        viewCount
        image
      }
    }
  }
`;
