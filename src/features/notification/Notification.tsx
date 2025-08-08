import { useState } from "react";
import { useWebSocket } from "./useWebSocket";
import NotificationList from "./NotificationList";

const Notifications = () => {
    const token = localStorage.getItem("access_token");
    const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}/notification/${token}`;

    const [messages, setMessages] = useState<any[]>([]);

    const { isConnected } = useWebSocket(wsUrl, (msg) => {
        setMessages((prev) => [...prev, ...(Array.isArray(msg) ? msg : [msg])]);
    });

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold text-[var(--primary-text)] mb-2">
                Notifications
            </h2>
            <p className="mb-4 text-[var(--text-secondary)]">
                Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </p>

            <NotificationList notifications={messages} />
        </div>
    );
};

export default Notifications;
