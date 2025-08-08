import {cn} from "../utils/utils.ts";

interface Props {
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
    isDisabled?: boolean;
    type?: "submit" | "button";
}

const SecondaryButton = ({onClick, type, children, className, isDisabled}: Props) => {

    return (
        <button
            className={cn(
                `border ${isDisabled ? 'border-var[--text-disabled] text-[var(--text-disabled)]' 
                : 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-text)] hover:bg-[var(--primary-hover)] '} 
                px-[15px] py-[5px] rounded-sm transition-colors duration-200 flex gap-3 justify-center self-start w-full`, className)}
            onClick={onClick}
            type={type}
            disabled={isDisabled}
        >{children}
        </button>
    )
}
export default SecondaryButton
