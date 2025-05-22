"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type ResetPasswordProps = {
  onSubmit: (formData: any) => void;
  isLoading?: boolean;
};

export default function ResetPassword({
  onSubmit,
  isLoading,
}: ResetPasswordProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

    const validate = () => {
        const newErrors: {
            confirmPassword?: string; password?: string
        } = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (password && confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;
        if (Object.keys(errors).length !== 0) {
            return;
        }
        onSubmit(password);
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
              Reset Password
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
                      autoComplete="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1]"
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

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Reseting Password..." : "Reset Password"}
                  </button>
                </div>
              </form>
              <div className="mt-6">
                <div className="relative">
                  <div className="relative flex justify-center text-sm">
                    <Link
                      href="/login"
                      className="font-medium text-primary hover:text-secondary"
                    >
                      Back to Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
