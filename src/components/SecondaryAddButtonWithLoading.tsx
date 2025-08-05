import SmallSpinner from "./SmallSpinner.tsx";
import SecondaryButton from "./SecondaryButton.tsx";

interface Props {
    isDisabled?: boolean;
    className?: string;
    isLoading?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit';
    children?: React.ReactNode;
}

const SecondaryAddButtonWithLoading = ({isLoading, children, type, isDisabled, className, onClick}: Props) => {
    return (
        <SecondaryButton type={type} isDisabled={isDisabled} className={className} onClick={onClick}>
            {isLoading && (
                <SmallSpinner />
            ) }
            {children}
        </SecondaryButton>
    )
}
export default SecondaryAddButtonWithLoading
