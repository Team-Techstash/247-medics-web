'use client'
import { useState } from "react";
import Login from "../components/login";
import HeroWhatWeTreat from "../components/HeroWhatWeTreat";
import HowDoesItWork from "./../components/HowDoesItWork";

import CTA3 from "./../components/CTA3";
import CTA from "./../components/CTA";
import FAQWhatWeTreat from "./../components/FAQWhatWeTreat";

import MainLayout from "./../layouts/MainLayout";
import { authService } from "@/api/services/service";
import { useRouter } from "next/navigation";
import { showToast } from '../../utils/toast';
import Link from "next/link";


export default function LoginPage() {
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
            <Login onSubmit={handleSubmit} isLoading={isLoading} />
            <Link href="/forgot-password" className="font-medium text-primary hover:text-secondary/80">
                Forgot password?
            </Link>
        </>
    );
}

