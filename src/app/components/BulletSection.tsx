"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button2 from "./Button2";

const conditions = [
    "Acid reflux (GERD)",
    "Acne",
    "Asthma",
    "Bacterial Vaginosis (BV)",
    "Bug bites, skin infections",
    "Cold sores",
    "Cough, cold, fever",
    "ED",
    "Food poisoning, diarrhea",
    "Genital Herpes",
    "Pink eye",
    "Rash and eczema",
    "Sinus infections",
    "Sore throat, strep throat",
    "Urinary tract infections (UTI)",
    "Vaginal yeast infections",
];

const BulletSection = () => {
    return (
        <section className="relative bg-light py-10 px-6 lg:py-20">
            <div className="container mx-auto">
                <div className="grid lg:grid-cols-2 gap-5 md:gap-12">

                    {/* Left Side: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="xl:w-3/4">
                            <h2 className="text-2xl md:text-4xl 2xl:text-6xl font-medium text-primary mb-3">
                            What we treat
                            </h2>
                            <p className="mt-3 text-lg text-primary mb-5 md:text-lg">
                                Get treatment for a range of symptoms and conditions right from your smartphone.
                            </p>
                        </div>
                        <Image
                            src="/images/laptop.jpg" // Replace with actual image
                            alt="Doctor Consultation"
                            width={500}
                            height={350}
                            className="rounded-xl shadow-lg w-full h-auto"
                        />
                    </motion.div>

                    {/* Right Side: Text & Bullets */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Bullet Points Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3 mb-10">
                            {conditions.map((condition, index) => (
                                <div key={index} className="flex items-center gap-2 text-primary xl:text-xl my-1">
                                    <span className="bg-secondary w-7 h-7 rounded-full flex align-center justify-center">
                                        <Image
                                            src="/images/btn-arrow.svg" // Replace with actual image
                                            alt="Doctor Consultation"
                                            width={10}
                                            height={10}
                                        />
                                    </span>
                                    <p className="truncate">{condition}</p>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <div className="text-center lg:text-start">
                            <Button2 text="what we treat" href="/appointment" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default BulletSection;
