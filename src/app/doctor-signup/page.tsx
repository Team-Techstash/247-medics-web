'use client'
import { useState } from "react";
import DoctorSignUp from "../components/doctorSignup";

import { authService } from "@/api/services/service";
import { useRouter, useSearchParams } from "next/navigation";
import { showToast } from '../../utils/toast';
import Cookies from 'js-cookie';


export default function DoctorSignUpPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
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
                Cookies.set('authToken', response.token, { expires: 7 }); 
                localStorage.setItem("authToken", response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                // Get the redirect path from query params, default to home
                const from = searchParams.get('from') || '/';
                router.push(from);
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
            <DoctorSignUp onSubmit={handleSubmit} isLoading={isLoading} />
        </>
    );
}

