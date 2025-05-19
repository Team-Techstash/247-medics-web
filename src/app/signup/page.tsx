'use client'
import { useState } from "react";
import SignUp from "../components/signup";
import HeroWhatWeTreat from "../components/HeroWhatWeTreat";
import HowDoesItWork from "../components/HowDoesItWork";

import CTA3 from "../components/CTA3";
import CTA from "../components/CTA";
import FAQWhatWeTreat from "../components/FAQWhatWeTreat";

import MainLayout from "../layouts/MainLayout";
import { authService } from "@/api/services/service";
import { useRouter } from "next/navigation";
import { showToast } from '../../utils/toast';

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: any) => {
        setFormData(data);
        setIsLoading(true);
        console.log(data)

        try {
            const response = await authService.register(data);
            if (response && response.token) {
                showToast.success('SignUp successful!');
                localStorage.setItem("authToken", response.token);
                router.push("/");
            } else {
                showToast.error(response.message || "SignUp failed");
            }
        } catch (err: any) {
            showToast.error(err.message || "SignUp failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <SignUp onSubmit={handleSubmit} isLoading={isLoading} />
        </>
    );
}

