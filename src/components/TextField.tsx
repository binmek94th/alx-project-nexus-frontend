import type { UseFormRegisterReturn } from "react-hook-form";
import React from "react";
import { cn } from "../utils/utils.ts";

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    title?: string;
    register?: UseFormRegisterReturn;
    error?: string;
    placeholder?: string;
    required?: boolean;
    variant?: "small" | "large";
    className?: string;
    disabled?: boolean;
    type?: "text" | "password";
    handleChange?: (value: any) => void;
}

const TextField = ({
                       title,
                       register,
                       error,
                       type,
                       placeholder,
                       handleChange,
                       disabled,
                       className,
                       variant,
                       required,
                       ...rest
                   }: Props) => {
    const cls = cn(
        `border-1 rounded-sm 
     ${error ? "border-[var(--error)] text-[var(--error)]" : "border-[var(--primary)]"}
     bg-[var(--paper-custom)]
     text-[var(--text-tertiary)]
     hover:border-[var(--primary-hover)]
     focus:border-[var(--primary-hover)]
     focus:ring-0 focus:ring-offset-0 focus:outline-none
     focus:shadow-none !ring-0 !shadow-none
     selection:bg-[var(--primary)]
     selection:text-[var(--text-tertiary)]
     placeholder:text-[var(--text-tertiary)]
     ml-[-8px] p-3
     ${variant === "small" ? "!w-40" : "w-full"}
     h-[37px]`
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
        <div className={cn("flex flex-col gap-2 items-start text-left my-5", className)}>
            <label
                className={`${
                    error ? "text-[var(--error)]" : "text-[var(--primary-text)]"
                }`}
                htmlFor={inputProps.id}
            >
                {title} {required && <span className="text-[var(--error)]">*</span>}
            </label>
            <input className={cls} {...inputProps} />
            {error && <span className="text-[var(--error)] text-sm mt-[-5px]">{error}</span>}
        </div>
    );
};

export default TextField;
