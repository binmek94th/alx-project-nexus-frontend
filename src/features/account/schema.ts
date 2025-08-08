import { z } from "zod";

export const accountSchema = z.object({
    full_name: z.string().min(1, "Full name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    bio: z.string().max(200).optional(),
    privacy_choice: z.enum(["public", "private"]),
    profile_picture: z
        .instanceof(File)
        .optional()
        .refine(file => !file || file.size <= 5 * 1024 * 1024, "Max file size 5MB"),
});

export const emailSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const passwordSchema = z
    .object({
        new_password: z.string().min(8, "New password must be at least 8 characters"),
        confirm_password: z.string(),
    })
    .refine((data) => data.new_password === data.confirm_password, {
        message: "Passwords don't match",
        path: ["confirm_password"],
    });
