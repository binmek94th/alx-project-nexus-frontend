import { useEffect, useRef, useState } from "react";
import {navigateTo} from "../../utils/router.ts";

export function useWebSocket(url: string, onMessage?: (msg: any) => void) {
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!url) return;

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("✅ WebSocket connected");
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (!data.error) onMessage?.(data);
                else if (data.error === "Token is invalid or expired") {
                    navigateTo("/login");
                }
                console.log(data.error);
            } catch {
                console.warn("Non-JSON message:", event.data);
                onMessage?.(event.data);
            }
        };

        ws.onerror = (err) => {
            console.error("❌ WebSocket error", err);
        };

        ws.onclose = () => {
            console.log("🔌 WebSocket disconnected");
            setIsConnected(false);
        };

        return () => {
            ws.close();
        };
    }, [url]);

    const sendMessage = (msg: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(msg));
        }
    };

    return { isConnected, sendMessage };
}
