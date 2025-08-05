import { toast } from "sonner";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

export const showToast = (type: ToastType, message: string) => {
    const config = {
        success: {
            bg: "#00975e",
            border: "2px solid #0b8155",
            icon: <CheckCircle size={20} color="white" />,
        },
        error: {
            bg: "#d32929",
            border: "2px solid #9e2121",
            icon: <AlertCircle size={20} color="white" />,
        },
        info: {
            bg: "#3361C3",
            border: "2px solid #274c9e",
            icon: <Info size={20} color="white" />,
        },
        warning: {
            bg: "#f68d00",
            border: "2px solid #d37800",
            icon: <AlertTriangle size={20} color="white" />,
        },
    }[type];

    toast.custom(() => (
        <div
            className="flex items-center gap-2 p-3 rounded shadow-md"
            style={{
                background: config.bg,
                color: "white",
                border: config.border,
                minWidth: "300px",
            }}
        >
            {config.icon}
            <span>{message}</span>
        </div>
    ));
};
