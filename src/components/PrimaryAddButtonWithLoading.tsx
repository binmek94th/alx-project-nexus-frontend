import PrimaryButton from "./PrimaryButton.tsx";
import SmallSpinner from "./SmallSpinner.tsx";
import {Plus} from "lucide-react";

interface Props {
    isDisabled?: boolean;
    className?: string;
    isLoading?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
    type?: 'button' | 'submit';
}

const PrimaryAddButtonWithLoading = ({isLoading, isDisabled, type, children, className, onClick}: Props) => {
    return (
        <PrimaryButton type={type} isDisabled={isDisabled} className={className} onClick={onClick}>
            {isLoading ? (
                <SmallSpinner />
            ) : <Plus />}
            {children}
        </PrimaryButton>
    )
}
export default PrimaryAddButtonWithLoading
