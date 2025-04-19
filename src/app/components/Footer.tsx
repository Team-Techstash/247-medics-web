"use client";

import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";
import {usePathname} from "next/navigation";

const Footer: React.FC = () => {
    const pathname = usePathname(); // ✅ Get current path

    // Hide header on the registration page
    if (pathname === "/registration") return null;

    // Function to scroll to top
    const handleScrollToTop = (): void => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-white text-primary text-sm pt-8">
            <div className="container mx-auto grid lg:grid-cols-5 gap-8 px-6">
                <div className="lg:col-span-2 pe-10">
                    <Image
                        src="/images/logo.svg"
                        alt="24/7 Medics"
                        width={150}
                        height={50}
                        className="mb-8"
                    />
                    <p className="text-primary">
                        At 24/7 Medics, we specialize in supporting clinical labs and healthcare innovators.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                    <ul className="text-lg space-y-2">
                        <li><Link href="/" className="hover:underline">Home</Link></li>
                        <li><Link href="/about" className="hover:underline">About Us</Link></li>
                        <li><Link href="/services" className="hover:underline">Services</Link></li>
                        <li><Link href="/blog" className="hover:underline">Blogs</Link></li>
                        <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-4">Social Media</h3>
                    <ul className="text-lg space-y-2">
                        <li><Link href="/" className="flex items-center gap-2 hover:underline"><FaFacebookF /> Facebook</Link></li>
                        <li><Link href="/" className="flex items-center gap-2 hover:underline"><FaInstagram /> Instagram</Link></li>
                        <li><Link href="/" className="flex items-center gap-2 hover:underline"><FaLinkedinIn /> LinkedIn</Link></li>
                        <li><Link href="/" className="flex items-center gap-2 hover:underline"><FaTwitter /> Twitter</Link></li>
                        <li><Link href="/" className="flex items-center gap-2 hover:underline"><FaYoutube /> YouTube</Link></li>
                    </ul>
                </div>

                {/* Back to Top Button */}
                <div className="hidden md:flex flex-col items-center">
                    <button
                        onClick={handleScrollToTop}
                        className="w-41 h-41 flex items-center justify-center border-2 border-primary rounded-full mb-3"
                        aria-label="Back to top"
                    >
                        <Image
                            src="/images/arrow-up.svg"
                            alt="Arrow"
                            width={51}
                            height={38}
                        />
                    </button>
                    <span className="text-xl">Back To Top</span>
                </div>
            </div>

            <div className="py-8 text-center text-primary">
                <div className="container mx-auto lg:flex justify-between align-center">
                    <p>© 2025 24/7 Medics</p>
                    <div className="space-x-4 mt-3 lg:mt-0">
                        <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
                        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
