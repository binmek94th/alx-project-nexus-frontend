import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateEmailMutation } from "./api";
import { z } from "zod";
import { toast } from "sonner";
import {emailSchema} from "./schema.ts";
import TextField from "../../components/TextField.tsx";
import SecondaryButton from "../../components/SecondaryButton.tsx";
import Typography from "../../components/Typography.tsx";
import {useNavigate} from "react-router-dom";

type EmailForm = z.infer<typeof emailSchema>;

const UpdateEmail = () => {
    const [updateEmail, { isLoading }] = useUpdateEmailMutation();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EmailForm>({
        resolver: zodResolver(emailSchema),
    });

    const onSubmit = async (data: EmailForm) => {
        try {
            await updateEmail(data).unwrap();
            toast.success("Email updated!");
            navigate("/verify_email");
        } catch(error: any) {
            toast.error(error.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Typography variant={'h2'}>Update Email</Typography>
            <TextField title={"Email"} register={register("email")} error={errors.email?.message} />
            <SecondaryButton
                type="submit"
                isDisabled={isLoading}
            >
                {isLoading ? "Updating..." : "Update Email"}
            </SecondaryButton>
        </form>
    );
};

export default UpdateEmail;
