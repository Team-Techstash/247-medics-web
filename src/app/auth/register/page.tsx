"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authService } from "@/api/services/auth.service";
import type {
    RegisterFormData,
    RegisterFormErrors,
    Address
} from "@/api/types/auth.types";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        address: {
            streetAddress1: "",
            streetAddress2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
        },
    });
    const [errors, setErrors] = useState<RegisterFormErrors>({});
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.startsWith("address.")) {
            const key = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [key]: value,
                },
            }));
            if (errors.address?.[key as keyof Address]) {
                setErrors((prev) => ({
                    ...prev,
                    address: { ...prev.address, [key]: undefined },
                }));
            }
        } else {
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
        // Address validation
        if (!formData.address.streetAddress1.trim()) {
            newErrors.address = { ...newErrors.address, streetAddress1: "Street address is required" };
            isValid = false;
        }
        if (!formData.address.city.trim()) {
            newErrors.address = { ...newErrors.address, city: "City is required" };
            isValid = false;
        }
        if (!formData.address.country.trim()) {
            newErrors.address = { ...newErrors.address, country: "Country is required" };
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!validate()) return;
        setIsLoading(true);

        try {
            const response = await authService.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                // Add phone and address to your backend/register API if needed
            });
            if (response.data?.token) {
                localStorage.setItem("authToken", response.data.token);
            }
            // Redirect or show success
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="font-medium text-secondary hover:text-secondary/80">
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
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary"
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
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary"
                                    />
                                </div>
                                {errors.lastName && <div className="text-red-600 text-xs mt-1">{errors.lastName}</div>}
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
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary"
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
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary"
                                />
                            </div>
                            {errors.phone && <div className="text-red-600 text-xs mt-1">{errors.phone}</div>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary"
                                />
                            </div>
                            {errors.password && <div className="text-red-600 text-xs mt-1">{errors.password}</div>}
                        </div>

                        <div>
                            <label htmlFor="streetAddress1" className="block text-sm font-medium text-gray-700">
                                Street Address 1
                            </label>
                            <div className="mt-1">
                                <input
                                    id="streetAddress1"
                                    name="address.streetAddress1"
                                    type="text"
                                    value={formData.address.streetAddress1}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary"
                                />
                            </div>
                            {errors.address?.streetAddress1 && <div className="text-red-600 text-xs mt-1">{errors.address.streetAddress1}</div>}
                        </div>

                        <div>
                            <label htmlFor="streetAddress2" className="block text-sm font-medium text-gray-700">
                                Street Address 2 (Optional)
                            </label>
                            <div className="mt-1">
                                <input
                                    id="streetAddress2"
                                    name="address.streetAddress2"
                                    type="text"
                                    value={formData.address.streetAddress2}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                    City
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="city"
                                        name="address.city"
                                        type="text"
                                        value={formData.address.city}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary"
                                    />
                                </div>
                                {errors.address?.city && <div className="text-red-600 text-xs mt-1">{errors.address.city}</div>}
                            </div>

                            <div>
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                    State
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="state"
                                        name="address.state"
                                        type="text"
                                        value={formData.address.state}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                                    Postal Code
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="postalCode"
                                        name="address.postalCode"
                                        type="text"
                                        value={formData.address.postalCode}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                    Country
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="country"
                                        name="address.country"
                                        type="text"
                                        value={formData.address.country}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary"
                                    />
                                </div>
                                {errors.address?.country && <div className="text-red-600 text-xs mt-1">{errors.address.country}</div>}
                            </div>
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
        </div>
    );
} 