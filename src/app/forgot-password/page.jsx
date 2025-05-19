'use client'
import { useState } from "react";
import ForgotPassword from "../components/forgotPassword"
import HeroWhatWeTreat from "../components/HeroWhatWeTreat";
import HowDoesItWork from "./../components/HowDoesItWork";

import CTA3 from "./../components/CTA3";
import CTA from "./../components/CTA";
import FAQWhatWeTreat from "./../components/FAQWhatWeTreat";

import MainLayout from "./../layouts/MainLayout";
import { authService } from "@/api/services/service";
import { useRouter } from "next/navigation";
import { showToast } from '../../utils/toast';


export default function ForgotPasswordPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: any) => {
        setFormData(data);
        setIsLoading(true);
        console.log(data)

        try {
            const response = await authService.login(data);
            if (response && response.token) {
                showToast.success('Login successful!');
                localStorage.setItem("authToken", response.token);
                router.push("/");
            } else {
                showToast.error(response.message || "Login failed");
            }
        } catch (err: any) {
            showToast.error(err.message || "Login failed");
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

