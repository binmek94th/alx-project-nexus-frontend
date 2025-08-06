import {baseApi} from "../../services/api.ts";
import type {Profile} from "../follow/hooks/useProfile.ts";

export interface Post {
    id: string;
    caption: string;
    image: string;
    createdAt?: string;
    updatedAt?: string;
    likeCount: number;
    commentCount: number;
    viewCount: number;
    author: Profile;
    isFollowingAuthor: boolean;
    liked: boolean;
}

interface Comment {
    id: string;
    user: string;
    post: string;
}

export const postApi = baseApi.injectEndpoints({

    endpoints: (build) => ({
        getPosts: build.query({
            query: ({ cursor }) => ({
                url: 'graphql/',
                method: 'POST',
                body: {
                    query: `
        query AllPosts($after: String) {
          allPosts(first: 10, after: $after) {
            edges {
              node {
                id
                caption
                image
                createdAt
                likeCount
                commentCount
                viewCount
                author {
                  id
                  username
                  fullName
                }
              }
              cursor
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
      `,
                    variables: { after: cursor }
                }
            }),
            transformResponse: (response) => {
                const edges = response.data.allPosts.edges;
                return {
                    results: edges.map((edge: any) => edge.node),
                    nextCursor: response.data.allPosts.pageInfo.hasNextPage ? response.data.allPosts.pageInfo.endCursor : null
                };
            }
        }),

        getPost: build.query<Post, number>({
            query: (id) => `api/posts/${id}/`,
            providesTags: (_result, _err, id) => [{ type: 'Post', id }],
        }),

        createPost: build.mutation<Post, FormData>({
            query: (formData) => ({
                url: 'api/post/posts',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Post'],
        }),

        updatePost: build.mutation<Post, { id: number; formData: FormData }>({
            query: ({ id, formData }) => ({
                url: `api/post/posts/${id}/`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: (_result, _err, { id }) => [{ type: 'Post', id }],
        }),

        deletePost: build.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `api/post/posts/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Post'],
        }),

        likePost:build.mutation<{success: boolean}, string>({
            query: (id) => ({
                url: `api/post/likes/`,
                method: 'POST',
                body: {post: id}
            })
        }),

        unLikePost:build.mutation<{success: boolean}, string>({
            query: (id) => ({
                url: `api/post/likes/`,
                method: 'POST',
                body: {post: id}
            })
        }),

        addComment: build.mutation<{ comment: Comment }, { content: string; id: string, comment?: string; }>({
            query: ({ content, comment, id }) => ({
                url: 'api/post/comments/',
                method: 'POST',
                body: {
                    post: id,
                    comment: comment,
                    content: content,
                },
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetPostsQuery,
    useGetPostQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useLikePostMutation,
    useAddCommentMutation,
    useUnLikePostMutation,
} = postApi;
