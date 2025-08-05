import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import Spinner from "../../components/Spinner.tsx";
import { useVerifyEmailMutation } from "./api.ts";

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    const navigate = useNavigate();
    const [verifyEmail] = useVerifyEmailMutation();

    useEffect(() => {
        const submit = async () => {
            if (!uid || !token) return;

            try {
                await verifyEmail({ uid, token }).unwrap();
                toast.success("Email verified successfully.");
                navigate("/login");
            } catch (error: any) {
                const message =
                    error?.data?.error || error?.data?.message || "Verification failed.";
                toast.error(message);
                navigate("/login");
            }
        };

        submit();
    }, [uid, token, verifyEmail, navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <Spinner />
        </div>
    );
};

export default VerifyEmailPage;
