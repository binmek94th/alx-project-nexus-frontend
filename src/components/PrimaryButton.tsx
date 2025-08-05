import { cn } from "../../../../../ZNAR_project/admin_frontend/admin-frontend/src/lib/utils.ts";

interface Props {
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
    isDisabled?: boolean;
    type?: 'button' | 'submit';
}

const PrimaryButton = ({ onClick, type='button', children, className, isDisabled }: Props) => {
    return (
        <button
            type={type || 'button'}
            className={cn(
                className,
                `${isDisabled
                    ? "bg-[var(--text-disabled)] cursor-not-allowed"
                    : "bg-[var(--primary-custom)] hover:bg-[var(--primary-hover)]"}
                    px-4 py-2 text-[var(--text-quaternary)] rounded-sm self-start
                    transition-colors duration-200 flex gap-2 items-center justify-center whitespace-nowrap`
            )}
            onClick={onClick}
            disabled={isDisabled}
        >
            {children}
        </button>
    );
};

export default PrimaryButton;
