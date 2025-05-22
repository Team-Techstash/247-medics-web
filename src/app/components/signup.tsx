"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authService } from "@/api/services/service";
import { RegisterFormData, RegisterFormErrors } from '../../api/types/auth.types'
import { motion } from "framer-motion";


type SignUp = {
    onSubmit: (formData: any) => void;
    isLoading?: boolean;
};
export default function SignUp({ onSubmit, isLoading }: SignUp) {
    const router = useRouter();
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: "",
        lastName: "",
        pronouns: "",
        email: "",
        phone: "",
        password: "",
        role: 'patient'
    });
    const [errors, setErrors] = useState<RegisterFormErrors>({});
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name as keyof RegisterFormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }

    };

    const validate = () => {
        const newErrors: RegisterFormErrors = {};
        let isValid = true;

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
            isValid = false;
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
            isValid = false;
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
            isValid = false;
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
            isValid = false;
        }
         if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required";
        } else if (formData.password && confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        if (Object.keys(errors).length !== 0) {
            return;
        }
        onSubmit(formData);
    };


    return (
        <section className="relative py-10 px-6 2xl:py-18 -mt-18 lg:h-full flex items-center">
            <div
                className="fixed top-0 left-0 w-full h-full object-cover object-center -z-10"
                style={{
                    backgroundImage: "url('/bg.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            />
            <div className=" absolute top-20 left-0 w-full h-fit bg-black/[.5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="container mx-auto relative h-full">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <Link href="/" className="flex justify-center">
                            <Image
                                src="/images/logo.svg"
                                alt="24/7 Medics"
                                width={150}
                                height={50}
                                className="mx-auto"
                            />
                        </Link>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                            Create your account
                        </h2>
                        <p className="mt-2 text-center text-sm text-white">
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-primary hover:text-secondary/80">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                            First name
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="firstName"
                                                name="firstName"
                                                type="text"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1]"
                                            />
                                        </div>
                                        {errors.firstName && <div className="text-red-600 text-xs mt-1">{errors.firstName}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                            Last name
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="lastName"
                                                name="lastName"
                                                type="text"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1]"
                                            />
                                        </div>
                                        {errors.lastName && <div className="text-red-600 text-xs mt-1">{errors.lastName}</div>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Pronouns
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="pronouns"
                                            name="pronouns"
                                            type="pronouns"
                                            autoComplete="pronouns"
                                            value={formData.pronouns}
                                            onChange={handleChange}
                                            className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1]"
                                        />
                                    </div>
                                    {errors.email && <div className="text-red-600 text-xs mt-1">{errors.email}</div>}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone number
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1]"
                                        />
                                    </div>
                                    {errors.phone && <div className="text-red-600 text-xs mt-1">{errors.phone}</div>}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <div className="relative mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1]"
                                        />
                                         <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    {errors.password && <div className="text-red-600 text-xs mt-1">{errors.password}</div>}
                                </div>

                                 <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </label>
                                    <div className="relative mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            autoComplete="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500"
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-600 !text-xs mt-1">{errors.confirmPassword}</p>}
                                </div>


                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? "Creating account..." : "Create account"}
                                    </button>
                                </div>

                            </form>
                        </div>

                    </div>
                </motion.div >
            </div >
        </section >
    );
} 