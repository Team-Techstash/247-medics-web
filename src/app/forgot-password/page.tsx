'use client'
import { useState } from "react";
import ForgotPassword from "../components/forgotPassword";

import { authService } from "@/api/services/service";
import { useRouter, useSearchParams } from "next/navigation";
import { showToast } from '../../utils/toast';


export default function ForgotPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: any) => {
        setFormData(data);
        setIsLoading(true);

        try {
            const response = await authService.forgotPassword(data);
            if (response && response.message === "OK") {
                  const token = response.resetToken;
                 router.push(`/reset-password/${token}`);
            } else {
                showToast.error(response.message || "An error occurred while verifying the account.");
            }
        } catch (err: any) {
            showToast.error(err.message || "An error occurred while verifying the account.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ForgotPassword onSubmit={handleSubmit} isLoading={isLoading} />
        </>
    );
}

