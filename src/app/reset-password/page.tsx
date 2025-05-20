'use client'
import { useState } from "react";
import ResetPassword from "../components/resetPassword";
import { authService } from "@/api/services/service";
import { useRouter, useSearchParams } from "next/navigation";
import { showToast } from '../../utils/toast';


export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    console.log(token)
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (password: any) => {
        console.log(password)
        setIsLoading(true);
                try {
            const response = await authService.resetPassword(token, password);
            if (response && response.message === "OK") {
                showToast.success("Your password has been successfully reset.")
                console.log(response.resetUrl)
            } else {
                showToast.error(response.message || "Unable to reset your password.");
            }
        } catch (err: any) {
            showToast.error(err.message || "Unable to reset your password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ResetPassword onSubmit={handleSubmit} isLoading={isLoading} />
        </>
    );
}

