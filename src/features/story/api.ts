import {baseApi, type Payload} from "../../services/api.ts";
import type {User} from "../user/api.ts";

export interface Story {
    id: string;
    author: User;
    caption: string;
    viewed: boolean;
    image?: string;
    created_at?: string;
    expires_at?: string;
}

export const storyApi = baseApi.injectEndpoints({
    endpoints: (build) => ({

        getStories: build.query<Payload<Story>, void>({
            query: () => ({
                url: `api/post/stories`,
                method: 'GET',
            }),
        }),

        getStory: build.query<Story, {id: string}>({
        query: ({id}) => ({
            url: `api/post/stories/${id}`,
            method: 'GET'
        }),
        }),
        postStory: build.mutation<Story, { image: File; caption: string }>({
            query: ({ image, caption }) => {
                const formData = new FormData();
                formData.append("image", image);
                formData.append("caption", caption);
                return {
                    url: "api/post/stories/",
                    method: "POST",
                    body: formData,
                };
            },
        }),

        updateStory: build.mutation<Story, {caption: string, id: string}> ({
            query: ({caption, id}) => ({
                url: `api/post/stories/${id}/`,
                method: 'PATCH',
                body: {caption}
            }),
            invalidatesTags: ["Story"]
        }),

        deleteStory: build.mutation<void, {id: string}> ({
            query: ({id}) => ({
                url: `api/post/stories/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Story"]
        })
    }),
    overrideExisting: false,
});

export const {
    useGetStoriesQuery,
    useGetStoryQuery,
    usePostStoryMutation,
    useDeleteStoryMutation,
    useUpdateStoryMutation,
} = storyApi;
