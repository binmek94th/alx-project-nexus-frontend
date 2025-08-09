import { useEffect, useRef, useState } from "react";
import { navigateTo } from "../../utils/router.ts";

export function useWebSocket(
    url: string,
    onMessage?: (msg: any) => void,
    retryDelay: number = 3000,
    maxRetries: number = 5
) {
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const retryCountRef = useRef(0);
    const reconnectTimeoutRef = useRef<number | null>(null);


    useEffect(() => {
        const connect = () => {
            if (!url) return;
    
            console.log(`🔄 Connecting to WebSocket: ${url}`);
            const ws = new WebSocket(url);
            wsRef.current = ws;
    
            ws.onopen = () => {
                console.log("✅ WebSocket connected");
                setIsConnected(true);
                retryCountRef.current = 0; // reset retries on successful connect
            };
    
            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (!data.error) {
                        onMessage?.(data);
                    } else if (data.error === "Token is invalid or expired") {
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
    
                if (retryCountRef.current < maxRetries) {
                    retryCountRef.current += 1;
                    console.log(`⏳ Reconnecting in ${retryDelay / 1000}s... (Attempt ${retryCountRef.current}/${maxRetries})`);
                    reconnectTimeoutRef.current = setTimeout(connect, retryDelay);
                } else {
                    console.error("❌ Max WebSocket retries reached.");
                }
            };
        };
        connect();
        return () => {
            if (wsRef.current) wsRef.current.close();
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        };
    }, [maxRetries, onMessage, retryDelay, url]);

    const sendMessage = (msg: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(msg));
        } else {
            console.warn("⚠️ Cannot send message: WebSocket not connected");
        }
    };

    return { isConnected, sendMessage };
}
