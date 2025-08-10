import NotificationList from "./NotificationList";
import {useEffect, useState} from "react";
import {useWebSocket} from "./useWebSocket.ts";

interface Props {
    setNewMessages: (value: boolean) => void;
}

const Notifications = ({setNewMessages}: Props) => {
    const token = localStorage.getItem("access_token");
    const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}/notification/${token}`;

    const [messages, setMessages] = useState<any[]>([]);

    const { isConnected } = useWebSocket(wsUrl, (msg) => {
        setMessages((prev) => [...prev, ...(Array.isArray(msg) ? msg : [msg])]);
    });

    useEffect(() => {
        const checkNewMessage = (messages: any[]) => {
            setNewMessages(false)
            for (const message of messages) {
                if (message.is_read === false) setNewMessages(true)
            }
        }
        checkNewMessage(messages)
    }, []);

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
