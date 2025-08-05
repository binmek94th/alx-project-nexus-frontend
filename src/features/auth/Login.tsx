import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation, useResetPasswordMutation } from "./api.ts";
import {type LoginFormData, loginSchema} from "./schema.ts";
import TextField from "../../components/TextField.tsx";
import SecondaryAddButtonWithLoading from "../../components/SecondaryAddButtonWithLoading.tsx";
import Typography from "../../components/Typography.tsx";
import {Link} from "react-router-dom";
import {toast} from "sonner";
import {useState} from "react";

const LoginForm = () => {
    const [login, { isLoading }] = useLoginMutation();
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetPassword, {isLoading: passwordLoading}] = useResetPasswordMutation()

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const res = await login(data).unwrap();
            localStorage.setItem("access_token", res.access);
            localStorage.setItem("refresh_token", res.refresh);
            reset();
            toast.success("Login successfully");
        } catch (err: any) {
            setError("root", {
                type: "server",
                message: err?.data?.detail || "Login failed",
            });
        }
    };
    const handlePasswordReset = () => {
        setShowResetDialog(true);
    };

    const closeDialog = () => {
        setShowResetDialog(false);
        setResetEmail("");
    };

    const submitResetEmail = async () => {
        if (!resetEmail) {
            toast.error("Please enter an email");
            return;
        }
        try {
            await resetPassword({email: resetEmail});
            toast.success(`Password reset link sent to ${resetEmail}`);
        }
        catch (err: any){
            toast.error(err.data.detail || "Sending Failed");
        }
        closeDialog();
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className={"flex min-h-120 justify-center align-center"}>
                <div className={"min-w-80 rounded-2xl border border-white/20 p-8"}>
                    <h2 className="text-2xl font-bold text-[var(--primary-text)] mb-2">Login</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between min-h-[400px]">
                        <div>
                            <TextField placeholder="Username" register={register("username")} error={errors.username?.message} />
                            <TextField type="password" placeholder="Password" register={register("password")} error={errors.password?.message} />
                            <Typography className="mb-2" variant="error">{errors.root?.message}</Typography>
                            <div className="min-w-80 mt-12 ml-[-15px]">
                                <SecondaryAddButtonWithLoading isLoading={isLoading} type="submit">Login</SecondaryAddButtonWithLoading>
                            </div>
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600 flex justify-center gap-2">
                                    Forgot password? {"  "}
                                    <p onClick={handlePasswordReset} className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200">
                                        Reset password
                                    </p>
                                </p>
                            </div>
                        </div>

                        <div className="mt-auto">

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{" "}
                                    <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200">
                                        Create one here
                                    </Link>
                                </p>
                            </div>
                            <p className="text-center text-xs text-gray-500">
                                By signing up, you agree to our{" "}
                                <Link to="/terms" className="text-blue-600 hover:text-blue-500">Terms of Service</Link>{" "}
                                and{" "}
                                <Link to="/privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link>.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
            {showResetDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-[var(--paper-custom)] rounded-lg p-6 w-120 shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 text-[var(--primary-text)]">
                            Reset Password
                        </h3>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="w-full p-2 rounded border border-[var(--primary)] bg-[var(--background)] text-[var(--primary-text)]"
                        />
                        <div className="mt-4 flex justify-end gap-4">
                            <button
                                onClick={closeDialog}
                                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
                            >
                                Cancel
                            </button>
                            <SecondaryAddButtonWithLoading isLoading={passwordLoading}
                                onClick={submitResetEmail}
                            >
                                Send
                            </SecondaryAddButtonWithLoading>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};


export default LoginForm;
