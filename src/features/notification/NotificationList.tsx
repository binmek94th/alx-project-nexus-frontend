import React, { useEffect } from "react";
import { formatRelativeTime } from "../../utils/date.ts";
import {useReadNotificationMutation} from "./api.ts";

interface Notification {
    id: string;
    user: string;
    message: string;
    is_read: boolean;
    created_at: string;
    updated_at: string;
    notification_type: string;
}

interface Props {
    notifications: Notification[];
}

const NotificationList: React.FC<Props> = ({ notifications }) => {
    const [readNotification] = useReadNotificationMutation()
    useEffect(() => {
        const updateNotification = async () => {
            for (const notification of notifications){
                if (!notification.is_read)
                    await readNotification({is_read: true, id: notification.id});
            }
        }
        updateNotification();
    }, [notifications, readNotification]);

    if (!notifications.length) {
        return (
            <div className="text-center text-[var(--text-secondary)] p-4">
                No notifications yet
            </div>
        );
    }

    return (
        <div className="bg-[var(--paper-custom)] rounded-xl p-4 space-y-3 w-100">
            {notifications.map((n) => (
                <div
                    key={n.id}
                    className={`flex flex-col p-3 rounded-lg ${
                        n.is_read ? "bg-transparent" : "bg-[var(--primary)]"
                    }`}
                >
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-[var(--primary-text)]">
                            {n.user}
                        </span>
                        <span className="text-xs text-[var(--text-tertiary)]">
                            {n.created_at ? formatRelativeTime(n.created_at) : n.created_at}
                        </span>
                    </div>
                    <p className="text-[var(--primary-text)] mt-1">{n.message}</p>
                </div>
            ))}
        </div>
    );
};

export default NotificationList;
