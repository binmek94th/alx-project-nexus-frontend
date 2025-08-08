import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdatePasswordMutation } from "./api";
import { z } from "zod";
import { toast } from "sonner";
import { passwordSchema } from "./schema";
import TextField from "../../components/TextField.tsx";
import SecondaryButton from "../../components/SecondaryButton.tsx";
import Typography from "../../components/Typography.tsx";

type PasswordForm = z.infer<typeof passwordSchema>;

const UpdatePassword = () => {
    const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema),
    });

    const onSubmit = async (data: PasswordForm) => {
        try {
            await updatePassword({new_password: data.new_password}).unwrap();
            toast.success("Password updated!");
        } catch {
            toast.error("Failed to update password");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Typography variant={'h2'}>Update Password</Typography>
            <TextField type={"password"} className={'mb-[-10px]'} title={"New Password"} register={register("new_password")} error={errors.new_password?.message} />
            <TextField type={"password"} title={"Confirm Password"} register={register("confirm_password")} error={errors.confirm_password?.message} />
            <SecondaryButton
                type="submit"
                isDisabled={isLoading}
            >
                {isLoading ? "Updating..." : "Update Password"}
            </SecondaryButton>
        </form>
    );
};

export default UpdatePassword;
