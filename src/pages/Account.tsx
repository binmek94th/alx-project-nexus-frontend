import UpdateAccount from "../features/account/UpdateAccount.tsx";
import UpdateEmail from "../features/account/UpdateEmail.tsx";
import UpdatePassword from "../features/account/UpdatePassword.tsx";

const Account = () => {
    return (
        <div className={'flex flex-col gap-8 pl-15 pt-10'}>
            <UpdateAccount></UpdateAccount>
            <UpdateEmail></UpdateEmail>
            <UpdatePassword></UpdatePassword>
        </div>
    )
}
export default Account
