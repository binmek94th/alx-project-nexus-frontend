import { cn } from "../utils/utils.ts";

interface Props {
    className?: string;
    children?: React.ReactNode;
    variant?: 'h1' | 'h2' | 'h3' | 'p' | 'label' | 'error' | 'non' | 'h5' | 'h4';
    onClick?: () => void;
    dangerouslySetInnerHTML?: { __html: string };
}

const Typography = ({
                        className,
                        children,
                        variant = 'p',
                        onClick,
                        dangerouslySetInnerHTML
                    }: Props) => {
    const variants = {
        h1: "text-2xl font-bold text-[var(--text-primary)]",
        h2: "text-2xl text-[var(--primary-text)]",
        h3: "text-base font-bold text-[var(--text-tertiary)]",
        h4: "text-1xl font-bold text-[var(--text-primary)]",
        h5: "text-base text-[var(--text-tertiary)] font-normal",
        p: "text-lg text-[var(--text-secondary)] font-normal",
        label: "text-base text-[var(--text-secondary)] font-normal",
        error: "text-sm text-[var(--error)] font-normal",
        non: ''
    };

    if (dangerouslySetInnerHTML) {
        return (
            <div
                onClick={onClick}
                className={cn(variants[variant], className)}
                dangerouslySetInnerHTML={dangerouslySetInnerHTML}
            />
        );
    }

    return (
        <div
            onClick={onClick}
            className={cn(variants[variant], className)}
        >
            {children}
        </div>
    );
};

export default Typography;
