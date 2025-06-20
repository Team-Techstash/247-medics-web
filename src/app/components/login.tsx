"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { GoogleLogin } from '@react-oauth/google';
import Cookies from "js-cookie";
import { showToast } from "@/utils/toast";
import { authService } from "@/api/services/service";

type LoginProps = {
  onSubmit: (formData: any) => void;
  isLoading?: boolean;
};

export default function Login({ onSubmit, isLoading }: LoginProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear the error for the field being changed
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
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

      console.log('Attempting to sign in with Google token...');
      const response = await authService.googleSignUp({
        googleAuthToken: credentialResponse.credential,
        role: "patient"
      });
      
      console.log('Google Sign-In Response:', response);
      
      if (response.token) {
        console.log('Token received, storing in cookies and localStorage...');
        Cookies.set('authToken', response.token, { expires: 7 });
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Get the redirect path from query params, default to home
        const from = searchParams.get('from') || '/';
        console.log('Redirecting to:', from);
        showToast.success('Sign in successful!');
        router.push(from);
      } else {
        console.error('No token in response:', response);
        showToast.error(response.message || 'Failed to sign in with Google');
      }
    } catch (error: any) {
      console.error('Google sign in error details:', {
        message: error.message,
        response: error.response,
        stack: error.stack
      });
      showToast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google sign in failed');
    showToast.error('Google sign in failed. Please try again.');
  };

  return (
    <section className="relative py-10 px-6 2xl:py-18 -mt-18 lg:h-screen flex items-center">
      <div
        className="fixed top-0 left-0 w-full h-full object-cover object-center -z-10"
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className=" absolute top-20 left-0 w-full h-full bg-black/[.5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
              Sign in to your account
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form
                className="space-y-6"
                onSubmit={handleSubmit}
              >
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
                      className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1]"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 !text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
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
                  {errors.password && (
                    <p className="text-red-600 !text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-secondary focus:ring-primary border-primary rounded hover:bg-primary/[.1]"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      href="/forgot-password"
                      className="font-medium text-secondary hover:text-secondary/80"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </button>
                </div>

                <div className="mt-6">
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
                        text="signin_with"
                        width="100%"
                      />
                    )}
                  </div>
                </div>

                <p className="mt-2 text-center !text-[14px] text-black">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-secondary hover:text-primary/80"
                  >
                    create a new account
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
