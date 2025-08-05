import React, { useRef } from "react";
import Typography from "./Typography.tsx";

interface Props {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}

const DialogBox = ({ title, children, onClose }: Props) => {
    const dialogRef = useRef<HTMLDivElement>(null);

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    return (
        <div
            onClick={handleBackdropClick}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflowY: "auto",
            }}
        >
            <div
                ref={dialogRef}
                style={{
                    backgroundColor: "var(--paper-custom)",
                    color: "var(--primary-text)",
                    borderRadius: "8px",
                    padding: "1.5rem 2rem",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
                    zIndex: 1001,
                    fontFamily: "sans-serif",
                    textAlign: "center",
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            >
                <Typography variant="h2">
                    {title || "Dialog Title"}
                </Typography>
                <div style={{ marginBottom: "1.5rem", color: "var(--text-tertiary)" }}>
                    {children}
                </div>
                <button
                    onClick={onClose}
                    style={{
                        backgroundColor: "var(--primary)",
                        color: "var(--primary-text)",
                        border: "none",
                        padding: "0.5rem 1.25rem",
                        fontWeight: 600,
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "var(--primary-hover)")
                    }
                    onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "var(--primary)")
                    }
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default DialogBox;
