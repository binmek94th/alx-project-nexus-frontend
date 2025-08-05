import { toast } from 'sonner';
import { useResendEmailMutation } from './api.ts';
import SecondaryAddButtonWithLoading from "../../components/SecondaryAddButtonWithLoading.tsx";
import {useState} from "react";
import TextField from "../../components/TextField.tsx";

const VerifyEmailPage = () => {
    const [resend_email, { isLoading }] = useResendEmailMutation();
    const [showEmailField, setShowEmailField] = useState(false);
    const [emailField, setEmailField] = useState("")

    const handleResendEmail = async () => {
        try {
            const storedEmail = localStorage.getItem('email');
            const email = storedEmail || emailField;

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                toast.error("Please enter a valid email");
                setShowEmailField(true);
                return null;
            }

            localStorage.removeItem('email');

            await resend_email({ email }).unwrap();
            toast.success('Verification email sent successfully!');
        } catch (error: any) {
            if (error?.status === 404) {
                toast.error('Email could not be found');
            } else {
                toast.error(error?.data?.detail || 'Something went wrong');
            }
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
            <div className="w-full max-w-md shadow-xl rounded-2xl border border-white/20 p-8 bg-[var(--paper-custom)]">
                <h1 className="text-3xl font-bold text-[var(--primary-text)] mb-4">
                    Verify Your Email
                </h1>

                <p className="text-sm text-[var(--text-tertiary)] mb-6">
                    We’ve sent a verification link to your email address. Please check your inbox and follow the instructions.
                </p>
                {showEmailField &&
                    <TextField handleChange={(value: string)=> setEmailField(value)} placeholder={"Email"} ></TextField>
                }

                <SecondaryAddButtonWithLoading onClick={()=> handleResendEmail()} isLoading={isLoading}>Resend Verification Email</SecondaryAddButtonWithLoading>

                <div className="mt-6 text-center">
                    <a
                        href="/login"
                        className="text-[var(--primary)] hover:text-[var(--primary-hover)] text-sm font-medium transition-colors duration-200"
                    >
                        Already verified? Log in now
                    </a>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
