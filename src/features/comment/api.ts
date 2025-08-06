import {baseApi} from "../../services/api.ts";

interface Comment {
    id: string;
    user: string;
    post: string;
}

export const commentApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        addComment: build.mutation<
            { comment: Comment },
            { content: string; id: string; comment?: string }
        >({
            query: ({ content, comment, id }) => ({
                url: 'api/post/comments/',
                method: 'POST',
                body: {
                    post: id,
                    comment: comment,
                    content: content,
                },
            }),
            invalidatesTags: (_result, _,
                              arg) => [{ type: 'Comment', id: arg.id }],
        }),


        getComments: build.query<Comment[], { post: string }>({
            query: ({ post }) => ({
                url: `api/post/comments?post_id=${post}`,
                method: 'GET',
            }),
            providesTags: (result, _, arg) =>
                result ? [{ type: 'Comment', id: arg.post }] : [{ type: 'Comment', id: 'LIST' }],
        }),


    }),
    overrideExisting: false,
});

export const {
    useAddCommentMutation,
    useGetCommentsQuery,
} = commentApi;
