import {baseApi} from "../../services/api.ts";

interface Notification {
    id: string;
    user: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        readNotification: build.mutation<{notification: Notification}, {is_read: boolean, id: string}>({
            query: ({is_read, id}) => ({
                url: `api/notification/notifications/${id}/`,
                method: 'PATCH',
                body: {
                    is_read: is_read
                }
            })
        })


    }),
    overrideExisting: false,
});

export const {
    useReadNotificationMutation
} = notificationApi;
