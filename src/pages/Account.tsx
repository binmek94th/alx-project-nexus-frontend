import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton.tsx";
import UpdateAccount from "../features/account/UpdateAccount.tsx";
import UpdateEmail from "../features/account/UpdateEmail.tsx";
import UpdatePassword from "../features/account/UpdatePassword.tsx";

const Account = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        navigate("/login");
    }
    return (
        <div className={'flex relative min-w-100 flex-col gap-8 pl-15 pt-10'}>
            <div className={'absolute top-0 left-75 w-full'}>
                <PrimaryButton onClick={handleLogout}>Logout</PrimaryButton>
            </div>
            <UpdateAccount></UpdateAccount>
            <UpdateEmail></UpdateEmail>
            <UpdatePassword></UpdatePassword>
        </div>
    )
}
export default Account
