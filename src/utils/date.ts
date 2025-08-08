export const formatRelativeTime = (date: Date | string): string => {
    const now = new Date();
    const target = new Date(date);
    const diff = now.getTime() - target.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (seconds < 60) return rtf.format(-seconds, "second");
    if (minutes < 60) return rtf.format(-minutes, "minute");
    if (hours < 24) return rtf.format(-hours, "hour");
    if (days < 30) return rtf.format(-days, "day");
    if (months < 12) return rtf.format(-months, "month");
    return rtf.format(-years, "year");
};


export function formatToHour(dateString: string) {
    const diffSeconds = (new Date(dateString).getTime() - Date.now()) / 1000;

    if (diffSeconds <= 0) return "expired";

    if (diffSeconds < 60) return `${Math.floor(diffSeconds)} seconds left`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes left`;
    return `${Math.floor(diffSeconds / 3600)} hours left`;
}
