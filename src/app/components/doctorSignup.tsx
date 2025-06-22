"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { authService, countryService } from "@/api/services/service";
import {
    RegisterFormData,
    RegisterFormErrors,
} from "../../api/types/auth.types";
import { motion } from "framer-motion";
import { GoogleLogin } from '@react-oauth/google';
import Cookies from "js-cookie";
import { showToast } from "@/utils/toast";
import SearchableCitySelector from "./SearchableCitySelector";

type DoctorSignUp = {
    onSubmit: (formData: any) => void;
    isLoading?: boolean;
};

interface Country {
    countryCode: string;
    countryName: string;
}

export default function DoctorSignUp({ onSubmit, isLoading }: DoctorSignUp) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [countryCode, setCountryCode] = useState("+");
    const [localNumber, setLocalNumber] = useState("");
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: "",
        lastName: "",
        pronouns: "",
        email: "",
        phone: "",
        password: "",
        role: "doctor",
        address: {
            streetAddress1: "",
            city: "",
            countryCode: "",
            countryName: ""
        },
        gender: "",
        age: 0,
        docProfile: {
            emergencyContact: {
                email: "",
                relation: "",
                fullName: "",
                phone: ""
            },
            regulatoryDetails: {
                authorityName: "",
                registrationNumber: "",
                onSpecialistRegister: false,
                allowStatusVerification: false
            }
        }
    });
    const [errors, setErrors] = useState<RegisterFormErrors>({});
    const [error, setError] = useState("");
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [countries, setCountries] = useState<Country[]>([]);

    useEffect(() => {
        if (formData.phone) {
            const match = formData.phone.match(/^(\+\d{1,4})(\d{4,})$/);
            if (match) {
                setCountryCode(match[1]);
                setLocalNumber(match[2]);
            }
        }
    }, []);

    useEffect(() => {
        countryService.getCountries()
            .then(response => {
                console.log('Countries API response:', response);
                setCountries(response.data);
            })
            .catch(err => {
                console.error('Failed to fetch countries:', err);
                setCountries([]);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const countryCode = e.target.value;
        const selectedCountry = countries.find((c: Country) => c.countryCode === countryCode);
        console.log("Selected country:", selectedCountry);
        setSelectedCountry(countryCode);
        setFormData(prev => {
            const updatedData = {
                ...prev,
                address: {
                    ...prev.address,
                    countryCode: countryCode,
                    countryName: selectedCountry?.countryName || "",
                    city: ""
                }
            };
            return updatedData;
        });
    };

    const handleCitySelect = (city: string) => {
        setFormData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                city: city
            }
        }));
    };

    const handleCityClear = () => {
        setFormData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                city: ""
            }
        }));
    };

    const handleCountryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/[^0-9+]/g, '');
        if (!val.startsWith('+')) val = '+' + val;
        setCountryCode(val);
        setFormData(prev => ({
            ...prev,
            phone: `${val}${localNumber.replace(/\s/g, '')}`
        }));
    };

    const handleLocalNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9 ]/g, '');
        setLocalNumber(val);
        setFormData(prev => ({
            ...prev,
            phone: `${countryCode}${val.replace(/\s/g, '')}`
        }));
    };

    const validateStep = () => {
        const newErrors: any = {};
        if (currentStep === 1) {
            if (!formData.firstName.trim()) {
                newErrors.firstName = "First name is required";
            }
            if (!formData.lastName.trim()) {
                newErrors.lastName = "Last name is required";
            }
            if (!formData.email.trim()) {
                newErrors.email = "Email is required";
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = "Email is invalid";
            }
            if (!formData.phone.trim()) {
                newErrors.phone = "Phone number is required";
            } else if (!formData.phone.startsWith('+')) {
                newErrors.phone = "Phone number must include country code";
            }
            if (!formData.address.streetAddress1.trim()) {
                newErrors.streetAddress1 = "Street address is required";
            }
            if (!formData.address.countryCode) {
                newErrors.country = "Country is required";
            }
            if (!formData.address.city.trim()) {
                newErrors.city = "City is required";
            }
            if (!formData.gender) {
                newErrors.gender = "Gender is required";
            }
            if (!formData.age) {
                newErrors.age = "Age is required";
            } else if (formData.age < 18) {
                newErrors.age = "You must be at least 18 years old";
            }
            if (!formData.password) {
                newErrors.password = "Password is required";
            } else if (formData.password.length < 6) {
                newErrors.password = "Password must be at least 6 characters";
            }
            if (!confirmPassword) {
                newErrors.confirmPassword = "Please confirm your password";
            } else if (formData.password !== confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }

            // Country code validation
            if (!countryCode || !/^\+\d{1,4}$/.test(countryCode)) {
                newErrors.phone = "Enter a valid country code (e.g., +1, +44, +971)";
            }

            // Phone number (local part) validation
            if (!localNumber || !/^\d{4,15}$/.test(localNumber.replace(/\s/g, ""))) {
                newErrors.phone = "Enter a valid phone number (4-15 digits, numbers only)";
            }
        } else if (currentStep === 2) {
            if (!formData.docProfile.emergencyContact.fullName.trim()) {
                newErrors.emergencyContactFullName = "Emergency contact name is required";
            }
            if (!formData.docProfile.emergencyContact.phone.trim()) {
                newErrors.emergencyContactPhone = "Emergency contact phone is required";
            }
            if (!formData.docProfile.emergencyContact.email.trim()) {
                newErrors.emergencyContactEmail = "Emergency contact email is required";
            } else if (!/\S+@\S+\.\S+/.test(formData.docProfile.emergencyContact.email)) {
                newErrors.emergencyContactEmail = "Emergency contact email is invalid";
            }
            if (!formData.docProfile.emergencyContact.relation.trim()) {
                newErrors.emergencyContactRelation = "Emergency contact relation is required";
            }
        } else if (currentStep === 3) {
            if (!formData.docProfile.regulatoryDetails.authorityName.trim()) {
                newErrors.authorityName = "Authority name is required";
            }
            if (!formData.docProfile.regulatoryDetails.registrationNumber.trim()) {
                newErrors.registrationNumber = "Registration number is required";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = validateStep();
        if (!isValid) return;
        setCurrentStep(prev => prev + 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = validateStep();
        if (!isValid) return;
        if (Object.keys(errors).length !== 0) {
            return;
        }
        onSubmit(formData);
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        console.log('Google Sign-In Response:', credentialResponse);
        setIsGoogleLoading(true);
        try {
            if (!credentialResponse.credential) {
                console.error('No credential received from Google');
                throw new Error('No credential received from Google');
            }

            const response = await authService.googleSignUp({
                googleAuthToken: credentialResponse.credential,
                role: "patient"
            });

            if (response.token) {
                console.log('Token received, storing in cookies and localStorage...');
                // Store the token in both cookie and localStorage
                Cookies.set('authToken', response.token, { expires: 7 });
                localStorage.setItem('authToken', response.token);
                localStorage.setItem("user", JSON.stringify(response?.user));

                // Get the redirect path from query params, default to home
                const from = searchParams.get('from') || '/';
                console.log('Redirecting to:', from);
                showToast.success('Sign up successful!');
                router.push(from);
            } else {
                console.error('No token in response:', response);
                showToast.error(response.message || 'Failed to sign up with Google');
            }
        } catch (error: any) {
            console.error('Google sign up error details:', {
                message: error.message,
                response: error.response,
                stack: error.stack
            });
            showToast.error(error.message || 'Failed to sign up with Google');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleGoogleError = () => {
        console.error('Google sign up failed');
        showToast.error('Google sign up failed. Please try again.');
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
            <div className="absolute top-20 left-0 w-full h-fit bg-black/[.5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="container mx-auto relative h-full"
                >
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
                        <div className="mt-4 flex justify-center">
                            <div className="flex space-x-4">
                                <div className={`h-2 w-20 rounded-full ${currentStep === 1 ? 'bg-secondary' : 'bg-gray-300'}`}></div>
                                <div className={`h-2 w-20 rounded-full ${currentStep === 2 ? 'bg-secondary' : 'bg-gray-300'}`}></div>
                                <div className={`h-2 w-20 rounded-full ${currentStep === 3 ? 'bg-secondary' : 'bg-gray-300'}`}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                            <form className="space-y-6" onSubmit={currentStep === 3 ? handleSubmit : handleNext}>
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                                        {error}
                                    </div>
                                )}

                                {currentStep === 1 ? (
                                    <>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="firstName"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    First name
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        id="firstName"
                                                        name="firstName"
                                                        type="text"
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                        className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] text-gray-700"
                                                    />
                                                </div>
                                                {errors.firstName && (
                                                    <div className="text-red-600 text-xs mt-1">
                                                        {errors.firstName}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="lastName"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Last name
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        id="lastName"
                                                        name="lastName"
                                                        type="text"
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                        className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] text-gray-700"
                                                    />
                                                </div>
                                                {errors.lastName && (
                                                    <div className="text-red-600 text-xs mt-1">
                                                        {errors.lastName}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium text-gray-700"
                                            >
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
                                                    className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] text-gray-700"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium text-gray-700"
                                            >
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
                                                    className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] text-gray-700"
                                                />
                                            </div>
                                            {errors.email && (
                                                <div className="text-red-600 text-xs mt-1">
                                                    {errors.email}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                Phone number
                                            </label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <input
                                                    type="text"
                                                    maxLength={5}
                                                    value={countryCode}
                                                    onChange={handleCountryCodeChange}
                                                    className="w-16 border border-primary rounded-l-md px-2 py-2 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] text-gray-700"
                                                    autoComplete="off"
                                                />
                                                <input
                                                    type="text"
                                                    value={localNumber}
                                                    onChange={handleLocalNumberChange}
                                                    className="flex-1 border border-primary rounded-r-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] text-gray-700"
                                                    autoComplete="off"
                                                />
                                            </div>
                                            {errors.phone && (
                                                <div className="text-red-600 text-xs mt-1">
                                                    {errors.phone}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="streetAddress1"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Street Address
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    id="streetAddress1"
                                                    name="address.streetAddress1"
                                                    type="text"
                                                    value={formData.address.streetAddress1}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        address: {
                                                            ...prev.address,
                                                            streetAddress1: e.target.value
                                                        }
                                                    }))}
                                                    className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] text-gray-700"
                                                />
                                            </div>
                                            {errors.streetAddress1 && (
                                                <div className="text-red-600 text-xs mt-1">
                                                    {errors.streetAddress1}
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="country"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Country
                                                </label>
                                                <div className="mt-1">
                                                    <select
                                                        id="country"
                                                        name="country"
                                                        value={selectedCountry}
                                                        onChange={handleCountryChange}
                                                        className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] text-gray-700"
                                                    >
                                                        <option value="">Select Country</option>
                                                        {countries.map((country: Country) => (
                                                            <option key={country.countryCode} value={country.countryCode}>
                                                                {country.countryName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {errors.country && (
                                                    <div className="text-red-600 text-xs mt-1">
                                                        {errors.country}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="city"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    City
                                                </label>
                                                <div className="mt-1">
                                                    <SearchableCitySelector
                                                        selectedCity={formData.address.city}
                                                        onCitySelect={handleCitySelect}
                                                        onCityClear={handleCityClear}
                                                        countryCode={selectedCountry}
                                                        disabled={!selectedCountry}
                                                    />
                                                </div>
                                                {errors.city && (
                                                    <div className="text-red-600 text-xs mt-1">
                                                        {errors.city}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="age"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Age
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    id="age"
                                                    name="age"
                                                    type="number"
                                                    min="0"
                                                    value={formData.age || ''}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        age: parseInt(e.target.value) || 0
                                                    }))}
                                                    onWheel={(e) => e.currentTarget.blur()}
                                                    className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] text-gray-700"
                                                />
                                            </div>
                                            {errors.age && (
                                                <div className="text-red-600 text-xs mt-1">
                                                    {errors.age}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="gender"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Gender
                                            </label>
                                            <div className="mt-1">
                                                <select
                                                    id="gender"
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        gender: e.target.value
                                                    }))}
                                                    className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] text-gray-700"
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            {errors.gender && (
                                                <div className="text-red-600 text-xs mt-1">
                                                    {errors.gender}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="password"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Password
                                            </label>
                                            <div className="relative mt-1">
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] text-gray-700"
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
                                            {errors.password && (
                                                <div className="text-red-600 text-xs mt-1">
                                                    {errors.password}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="password"
                                                className="block text-sm font-medium text-gray-700"
                                            >
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
                                                    className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] text-gray-700"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfirmPassword(!showConfirmPassword)
                                                    }
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500"
                                                    tabIndex={-1}
                                                >
                                                    {showConfirmPassword ? "Hide" : "Show"}
                                                </button>
                                            </div>
                                            {errors.confirmPassword && (
                                                <p className="text-red-600 !text-xs mt-1">
                                                    {errors.confirmPassword}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                ) : currentStep === 2 ? (
                                    <>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Emergency Contact Details</h3>

                                        <div>
                                            <label
                                                htmlFor="emergencyContactFullName"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Name
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    id="emergencyContactFullName"
                                                    name="docProfile.emergencyContact.fullName"
                                                    type="text"
                                                    value={formData.docProfile.emergencyContact.fullName}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        docProfile: {
                                                            ...prev.docProfile,
                                                            emergencyContact: {
                                                                ...prev.docProfile.emergencyContact,
                                                                fullName: e.target.value
                                                            }
                                                        }
                                                    }))}
                                                    className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] text-gray-700"
                                                />
                                            </div>
                                            {errors.emergencyContactFullName && (
                                                <div className="text-red-600 text-xs mt-1">
                                                    {errors.emergencyContactFullName}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="emergencyContactEmail"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Email
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    id="emergencyContactEmail"
                                                    name="docProfile.emergencyContact.email"
                                                    type="email"
                                                    value={formData.docProfile.emergencyContact.email}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        docProfile: {
                                                            ...prev.docProfile,
                                                            emergencyContact: {
                                                                ...prev.docProfile.emergencyContact,
                                                                email: e.target.value
                                                            }
                                                        }
                                                    }))}
                                                    className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] text-gray-700"
                                                />
                                            </div>
                                            {errors.emergencyContactEmail && (
                                                <div className="text-red-600 text-xs mt-1">
                                                    {errors.emergencyContactEmail}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="emergencyContactPhone"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Phone
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    id="emergencyContactPhone"
                                                    name="docProfile.emergencyContact.phone"
                                                    type="tel"
                                                    value={formData.docProfile.emergencyContact.phone}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        docProfile: {
                                                            ...prev.docProfile,
                                                            emergencyContact: {
                                                                ...prev.docProfile.emergencyContact,
                                                                phone: e.target.value
                                                            }
                                                        }
                                                    }))}
                                                    className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] text-gray-700"
                                                />
                                            </div>
                                            {errors.emergencyContactPhone && (
                                                <div className="text-red-600 text-xs mt-1">
                                                    {errors.emergencyContactPhone}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="emergencyContactRelation"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Relation
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    id="emergencyContactRelation"
                                                    name="docProfile.emergencyContact.relation"
                                                    type="text"
                                                    value={formData.docProfile.emergencyContact.relation}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        docProfile: {
                                                            ...prev.docProfile,
                                                            emergencyContact: {
                                                                ...prev.docProfile.emergencyContact,
                                                                relation: e.target.value
                                                            }
                                                        }
                                                    }))}
                                                    className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] text-gray-700"
                                                />
                                            </div>
                                            {errors.emergencyContactRelation && (
                                                <div className="text-red-600 text-xs mt-1">
                                                    {errors.emergencyContactRelation}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Regulatory Authority/Body Details</h3>

                                        <div>
                                            <label
                                                htmlFor="authorityName"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Authority Name
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    id="authorityName"
                                                    name="docProfile.regulatoryDetails.authorityName"
                                                    type="text"
                                                    value={formData.docProfile.regulatoryDetails.authorityName}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        docProfile: {
                                                            ...prev.docProfile,
                                                            regulatoryDetails: {
                                                                ...prev.docProfile.regulatoryDetails,
                                                                authorityName: e.target.value
                                                            }
                                                        }
                                                    }))}
                                                    className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] text-gray-700"
                                                />
                                            </div>
                                            {errors.authorityName && (
                                                <div className="text-red-600 text-xs mt-1">
                                                    {errors.authorityName}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="registrationNumber"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Registration Number
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    id="registrationNumber"
                                                    name="docProfile.regulatoryDetails.registrationNumber"
                                                    type="text"
                                                    value={formData.docProfile.regulatoryDetails.registrationNumber}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        docProfile: {
                                                            ...prev.docProfile,
                                                            regulatoryDetails: {
                                                                ...prev.docProfile.regulatoryDetails,
                                                                registrationNumber: e.target.value
                                                            }
                                                        }
                                                    }))}
                                                    className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] text-gray-700"
                                                />
                                            </div>
                                            {errors.registrationNumber && (
                                                <div className="text-red-600 text-xs mt-1">
                                                    {errors.registrationNumber}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4">
                                            <div className="grid grid-cols-[auto_1fr] gap-0">
                                                <input
                                                    id="onSpecialistRegister"
                                                    name="docProfile.regulatoryDetails.onSpecialistRegister"
                                                    type="checkbox"
                                                    checked={formData.docProfile.regulatoryDetails.onSpecialistRegister}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        docProfile: {
                                                            ...prev.docProfile,
                                                            regulatoryDetails: {
                                                                ...prev.docProfile.regulatoryDetails,
                                                                onSpecialistRegister: e.target.checked
                                                            }
                                                        }
                                                    }))}
                                                    className="h-4 w-4 mt-1 text-primary focus:ring-primary border-gray-300 rounded"
                                                />
                                                <label htmlFor="onSpecialistRegister" className="ml-2 block text-sm text-gray-900">
                                                    I am on the Specialist / GP Register
                                                </label>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <div className="grid grid-cols-[auto_1fr] gap-0">
                                                <input
                                                    id="allowStatusVerification"
                                                    name="docProfile.regulatoryDetails.allowStatusVerification"
                                                    type="checkbox"
                                                    checked={formData.docProfile.regulatoryDetails.allowStatusVerification}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        docProfile: {
                                                            ...prev.docProfile,
                                                            regulatoryDetails: {
                                                                ...prev.docProfile.regulatoryDetails,
                                                                allowStatusVerification: e.target.checked
                                                            }
                                                        }
                                                    }))}
                                                    className="h-4 w-4 mt-1 text-primary focus:ring-primary border-gray-300 rounded"
                                                />
                                                <label htmlFor="allowStatusVerification" className="ml-2 block text-sm text-gray-900">
                                                    I am happy for 24/7 Medics to check my online register status
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-between">
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep(prev => prev - 1)}
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        >
                                            Back
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="inline-flex ml-auto justify-end py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                    >
                                        {currentStep === 3 ? "Create Account" : "Next"}
                                    </button>
                                </div>

                                {/* <div className="mt-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-300" />
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        {isGoogleLoading ? (
                                            <div className="flex items-center justify-center w-full h-10 bg-gray-100 rounded-md">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                            </div>
                                        ) : (
                                            <GoogleLogin
                                                onSuccess={handleGoogleSuccess}
                                                onError={handleGoogleError}
                                                useOneTap
                                                theme="filled_blue"
                                                shape="rectangular"
                                                text="signup_with"
                                                width="100%"
                                            />
                                        )}
                                    </div>
                                </div> */}

                                <p className="mt-2 text-center !text-[14px] text-black">
                                    Already have an account?{" "}
                                    <Link
                                        href="/login"
                                        className="text-secondary hover:text-primary/80"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
