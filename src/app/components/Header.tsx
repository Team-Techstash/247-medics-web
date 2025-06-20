"use client"; // Ensure this runs on the client side

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Button2 from "./Button2";
import { Menu, X, User, Search, ChevronDown } from "lucide-react";
import { showToast } from "@/utils/toast";
import Cookies from 'js-cookie';
import { resetAppointmentForm } from '@/redux/slices/appointmentFormSlice';
import { useDispatch } from 'react-redux';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname(); // ✅ Get current path
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const dispatch = useDispatch();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("authToken");
            setAuthToken(token);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        Cookies.remove("authToken");
        setAuthToken(null);
        setShowDropdown(false);
        dispatch(resetAppointmentForm());
        showToast.success("Logged out successfully");
        router.push("/");
    };

    const handleSeeDoctorClick = (e: React.MouseEvent) => {
        if (authToken) {
            // const userStr = localStorage.getItem('user');
            // if (userStr) {
            //     const user = JSON.parse(userStr);
            //     if (!user.isProfileComplete) {
            //         e.preventDefault();
            //         router.push('/profile');
            //         showToast.warning('Please complete your profile first');
            //         return;
            //     }
            // }
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement search functionality here
        showToast.success(`Searching for: ${searchQuery}`);
    };

    // Hide header on the registration page
    if (pathname === "/registration") return null;
    if (pathname === "/create-appointment") return null;
    if (pathname === "/login") return null;
    if (pathname === "/signup") return null;

    const navLinks = [
        { href: "/how-it-works", label: "How it works" },
        { href: "/what-we-treat", label: "What we treat" },
        { href: "/online-doctor", label: "Online doctor" },
        { href: "/prices", label: "Prices" },
        // ...(authToken ? [{ href: "/appointments", label: "My Appointments" }] : []),
    ];

    return (
        <header className="bg-white py-4 px-6 fixed top-0 left-0 w-full z-50 shadow-lg">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/">
                        <Image
                            src="/images/logo.svg"
                            alt="24/7 Medics"
                            width={150}
                            height={50}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8 px-8 text-lg">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`hover:text-secondary ${pathname === href ? "text-secondary" : "text-primary"
                                    }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA Button and User Menu (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex items-center gap-8">
                            <Button2 text="See A Doctor" href="/create-appointment" style="secondary" onClick={handleSeeDoctorClick} />
                            <Button2 text="See Patient" href="/doctor-signup" style="primary" />
                            {authToken ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="flex items-center gap-2 text-primary hover:text-secondary transition-colors"
                                    >
                                        <User size={24} />
                                        <ChevronDown size={16} />
                                    </button>
                                    {showDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                View Profile
                                            </Link>
                                            <Link
                                                href="/appointments"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                My Appointments
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link href="/login" className="text-primary hover:text-secondary transition-colors">
                                    <User size={24} />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden z-50" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Search Bar - Below navigation on mobile */}
                <div className="mt-4 md:hidden">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
                        >
                            <Search size={20} />
                        </button>
                    </form>
                </div>

                {/* Mobile Drawer Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-0 right-0 w-3/4 h-full bg-white shadow-lg px-8 py-18 flex flex-col items-start justify-start space-y-8 md:hidden"
                    >
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`text-xl ${pathname === href ? "text-secondary" : "text-primary"
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                {label}
                            </Link>
                        ))}
                        <Button2 text="See A Doctor" href="/appointment" style="secondary" onClick={handleSeeDoctorClick} />
                        <Button2 text="See Patient" href="/doctor-signup" style="primary" />
                        {authToken ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="text-xl text-primary hover:text-secondary transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    View Profile
                                </Link>
                                <Link
                                    href="/appointments"
                                    className="text-xl text-primary hover:text-secondary transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    My Appointments
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-xl text-primary hover:text-secondary transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="text-xl text-primary hover:text-secondary transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <User size={24} />
                            </Link>
                        )}
                    </motion.div>
                )}
            </div>
        </header>
    );
};

export default Header;
