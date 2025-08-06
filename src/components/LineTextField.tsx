import type { UseFormRegisterReturn } from "react-hook-form";
import React from "react";
import { cn } from "../utils/utils.ts";

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    title?: string;
    register?: UseFormRegisterReturn;
    error?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    disabled?: boolean;
    type?: "text" | "password";
    handleChange?: (value: any) => void;
}

const LineTextField = ({
                           title,
                           register,
                           error,
                           type,
                           placeholder,
                           handleChange,
                           disabled,
                           className,
                           required,
                           ...rest
                       }: Props) => {
    const cls = cn(
        `border-0 border-b-2 rounded-none
         bg-transparent
         text-[var(--text-tertiary)]
         focus:outline-none focus:ring-0
         focus:border-[var(--primary-hover)]
         placeholder:text-[var(--text-tertiary)]
         ${error ? "border-b-[var(--error)] text-[var(--error)]" : "border-b-[var(--primary)]"}
         w-full py-1`
    );

    const inputProps = {
        type: type ?? "text",
        id: rest.id ?? rest.name ?? title,
        disabled,
        placeholder,
        "aria-invalid": !!error,
        ...rest,
        ...(register ? register : {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange?.(e.target.value),
        }),
    };

    return (
        <div className={cn("flex flex-col gap-1 items-start text-left my-4", className)}>
            {title && (
                <label
                    className={`text-sm ${
                        error ? "text-[var(--error)]" : "text-[var(--primary-text)]"
                    }`}
                    htmlFor={inputProps.id}
                >
                    {title} {required && <span className="text-[var(--error)]">*</span>}
                </label>
            )}
            <input className={cls} {...inputProps} />
            {error && <span className="text-[var(--error)] text-xs">{error}</span>}
        </div>
    );
};

export default LineTextField;
