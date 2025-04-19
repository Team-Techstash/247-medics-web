"use client"; // Ensure this runs on the client side

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Button2 from "./Button2";
import { Menu, X } from "lucide-react";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname(); // ✅ Get current path

    // Hide header on the registration page
    if (pathname === "/registration") return null;

    const navLinks = [
        { href: "/how-it-works", label: "How it works" },
        { href: "/what-we-treat", label: "What we treat" },
        { href: "/online-doctor", label: "Online doctor" },
        { href: "/prices", label: "Prices" },
    ];

    return (
        <header className="bg-white py-4 px-6 fixed top-0 left-0 w-full z-50">
            <div className="container mx-auto flex justify-between items-center">
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
                            className={`hover:text-secondary ${
                                pathname === href ? "text-secondary" : "text-primary"
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button className="md:hidden z-50" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* CTA Button (Hidden on Mobile) */}
                <div className="hidden md:block">
                    <Button2 text="See A Doctor" href="/appointment" style="primary" />
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
                                className={`text-xl ${
                                    pathname === href ? "text-secondary" : "text-primary"
                                }`}
                                onClick={() => setIsOpen(false)}
                            >
                                {label}
                            </Link>
                        ))}
                        <Button2 text="See A Doctor" href="/appointment" style="primary" />
                    </motion.div>
                )}
            </div>
        </header>
    );
};

export default Header;
