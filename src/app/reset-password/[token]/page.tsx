'use client'
import { useState } from "react";
import ResetPassword from "@/app/components/resetPassword";
import { authService } from "@/api/services/service";
import { useRouter, useSearchParams } from "next/navigation";
import { showToast } from "@/utils/toast";


export default function ResetPasswordPage({ params }: { params: { token: string } }) {
    const router = useRouter();
    const token = params.token;
    console.log(token)
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (password: any) => {
        console.log(password)
        setIsLoading(true);
        try {
            const data = { password };
            const response = await authService.resetPassword(token, data);
            if (response && response.message) {
                showToast.success("Your password has been successfully reset.")
                router.push('/login')
                console.log(response.resetUrl)
            } else {
                showToast.error(response.error || "Unable to reset your password.");
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

