import NotificationList from "./NotificationList";

interface Props {
    messages: any[];
    isConnected: boolean;
}

const Notifications = ({messages, isConnected}: Props) => {


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
