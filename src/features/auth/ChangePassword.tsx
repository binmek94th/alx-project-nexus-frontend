import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";
import {useChangePasswordMutation, useCheckPasswordResetLinkQuery} from "./api";
import {type ResetPasswordInput, resetPasswordSchema} from "./schema.ts";
import TextField from "../../components/TextField.tsx";

const ChangePassword = () => {
    const [searchParams] = useSearchParams();
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const { isError } = useCheckPasswordResetLinkQuery({ uid: uid!, token: token! }, { skip: !uid || !token });
    const [changePassword, {isLoading}] = useChangePasswordMutation()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
    });

    useEffect(() => {
        if (isError) {
            toast.error("Invalid or expired password reset link.");
            navigate("/login");
        }
    }, [isError, navigate]);

    const onSubmit = async (data: ResetPasswordInput) => {
        try {
            await changePassword({ uid: uid!, token: token!, password: data.password }).unwrap();
            toast.success("Password reset successful. You can now log in.");
            navigate("/login");
        } catch (error: any) {
            toast.error("Failed to reset password.");
            console.error(error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-[var(--paper-custom)] shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-[var(--text-tertiary)] text-center">Reset Your Password</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="new_password" className="block text-sm text-[var(--text-tertiary)] mb-[-14px] font-medium">
                        New Password
                    </label>
                    <TextField
                        type="password"
                        register={register("password")}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                <div>
                    <label htmlFor="confirm_password" className="block mb-[-14px] text-[var(--text-tertiary)] text-sm font-medium">
                        Confirm Password
                    </label>
                    <TextField
                        type="password"
                        register={register("confirm_password")}
                    />
                    {errors.confirm_password && <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                    {isLoading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
