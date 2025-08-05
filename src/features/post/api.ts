import {baseApi, type Payload} from "../../services/api.ts";

export interface Post {
    id: number;
    caption: string;
    image: string;
    created_at?: string;
    updated_at?: string;
}

export const postApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getPosts: build.query<Payload<Post>, {cursor?: string}>({
            query: ({ cursor }) => ({
                url: `post/posts/${cursor}`,
                params: cursor ? { cursor } : {},
            }),
        }),

        getPost: build.query<Post, number>({
            query: (id) => `posts/${id}/`,
            providesTags: (_result, _err, id) => [{ type: 'Post', id }],
        }),

        createPost: build.mutation<Post, FormData>({
            query: (formData) => ({
                url: 'post/posts',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Post'],
        }),

        updatePost: build.mutation<Post, { id: number; formData: FormData }>({
            query: ({ id, formData }) => ({
                url: `post/posts/${id}/`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: (_result, _err, { id }) => [{ type: 'Post', id }],
        }),

        deletePost: build.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `post/posts/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Post'],
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
} = postApi;
