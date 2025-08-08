import {Controller, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateAccountMutation } from "./api";
import { z } from "zod";
import { toast } from "sonner";
import {accountSchema} from "./schema.ts";
import TextField from "../../components/TextField.tsx";
import DropDown from "../../components/DropDown.tsx";
import {type ChangeEvent, useState} from "react";
import SecondaryButton from "../../components/SecondaryButton.tsx";
import Typography from "../../components/Typography.tsx";

type AccountForm = z.infer<typeof accountSchema>;

const UpdateAccount = () => {
    const unParsedUser = localStorage.getItem("user");
    const [updateAccount, { isLoading }] = useUpdateAccountMutation();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);


    const getDefaultValues = () => {
        if (!unParsedUser) return {
            full_name: "",
            username: "",
            privacy_choice: "public",
            bio: "",
        }
        const user = JSON.parse(unParsedUser)
        return {
            full_name: user.full_name ?? "",
            username: user.username ?? "",
            privacy_choice: user.privacy_choice ?? "public",
            bio: user.bio ?? "",
        }
    };

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<AccountForm>({
        resolver: zodResolver(accountSchema),
        defaultValues: unParsedUser ? getDefaultValues() : undefined,
    });


    const onSubmit = async (data: AccountForm) => {
        if (!unParsedUser) return null
        const formData = new FormData();
        formData.append("full_name", data.full_name);
        formData.append("username", data.username);
        formData.append("bio", data.bio || "");
        formData.append("privacy_choice", data.privacy_choice);
        if (imageFile) {
            formData.append("profile_picture", imageFile);
        }

        try {
            await updateAccount({body: formData}).unwrap();
            toast.success("Account updated!");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            const url = URL.createObjectURL(e.target.files[0]);
            setPreviewUrl(url);
        }
    };


    const privacyChoices = [
        {id: "public", label: "Public"},
        {id: "private", label: "Private"},
    ]
    if (!unParsedUser) return null

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
            <Typography variant={'h2'}>Update Account</Typography>
            <TextField title={"Full Name"} register={register("full_name")} error={errors.full_name?.message} />
            <TextField title={"Username"} register={register("username")} error={errors.username?.message} />
            <TextField title={"Bio"} register={register("bio")} error={errors.bio?.message} />
            <Controller
                control={control}
                name="privacy_choice"
                render={({field}) => (
                    <DropDown<{ label: string, id: string }>
                                                             options={privacyChoices}
                                                             title={'Privacy Choice'}
                                                             error={errors.privacy_choice?.message}
                                                             fields={['label']}
                                                             value={field.value ?? ''}
                                                             onSelect={field.onChange}></DropDown>
                )}
            />

            <label
                htmlFor="image-upload"
                className="relative cursor-pointer my-5 border-2 border-dashed border-[var(--primary)] rounded-md h-48 flex items-center justify-center bg-[var(--background)] hover:bg-[var(--paper-custom)] transition-colors duration-200"
            >
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain rounded-md"
                    />
                ) : (
                    <div className="flex flex-col items-center text-[var(--primary-text)]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 mb-2 text-[var(--primary)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 12l-4-4m0 0l-4 4m4-4v12"
                            />
                        </svg>
                        <span>Click or drag image here to upload</span>
                    </div>
                )}
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                    disabled={isLoading}
                />
            </label>

            <SecondaryButton
                type="submit"
                isDisabled={isLoading}
            >
                {isLoading ? "Updating..." : "Update Account"}
            </SecondaryButton>
        </form>
    );
};

export default UpdateAccount;
