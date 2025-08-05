import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {type RegisterFormData, registerSchema} from "./schema.ts";
import { useRegisterMutation } from "./api.ts";
import { useNavigate, Link } from "react-router-dom";
import TextField from "../../components/TextField.tsx";
import Typography from "../../components/Typography.tsx";
import SecondaryAddButtonWithLoading from "../../components/SecondaryAddButtonWithLoading.tsx";
import { toast } from "sonner";

const SignupForm = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const [signup, { isLoading }] = useRegisterMutation();

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const res = await signup(data).unwrap();
            if (res.email)
                localStorage.setItem("email", res.email);
            toast.success("Sign up successfully");
            navigate("/verify_email");
            reset()
        } catch (err: any) {
            if (err?.status === 400 && typeof err?.data === 'object')
                Object.entries(err.data).forEach(([field, messages]) => {
                    setError(field as keyof RegisterFormData, {
                        type: 'server',
                        message: String(messages),
                    });
                });
            else setError('root', {type: 'server', message: 'Unexpected Error Occurred'});
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className={"flex min-h-120 justify-center align-center"}>
                <div className={"min-w-80 rounded-2xl border border-white/20 p-8"}>
                    <h2 className="text-2xl font-bold text-[var(--primary-text)] mb-2">Create Account</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between min-h-[400px]">
                        <div>
                            <TextField placeholder="Username" register={register("username")} error={errors.username?.message} />
                            <TextField placeholder="Email" register={register("email")} error={errors.email?.message} />
                            <TextField placeholder="Full Name" register={register("full_name")} error={errors.full_name?.message} />
                            <TextField type="password" placeholder="Password" register={register("password")} error={errors.password?.message} />
                            <TextField type="password" placeholder="Confirm Password" register={register("confirm_password")} error={errors.confirm_password?.message} />
                            <Typography className="mb-2" variant="error">{errors.root?.message}</Typography>
                            <div className="min-w-80 mt-12 ml-[-15px]">
                                <SecondaryAddButtonWithLoading isLoading={isLoading} type="submit">Create Account</SecondaryAddButtonWithLoading>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{" "}
                                    <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200">
                                        Login here
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
        </div>
    );
};

export default SignupForm;
