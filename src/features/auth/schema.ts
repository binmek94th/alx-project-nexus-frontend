import z from "zod";

export const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3),
    full_name: z.string().min(3),
    password: z.string().min(6),
    confirm_password: z.string().min(6),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const resetPasswordSchema = z
    .object({
        password: z.string().min(8, "Password must be at least 8 characters."),
        confirm_password: z.string(),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match.",
        path: ["confirm_password"],
    });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;