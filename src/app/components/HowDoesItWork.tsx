"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button2 from "./Button2";

const data = [
    {
        title: "Answer a few questions",
        text: "Just complete a quick intake form with your needs and preferred appointment time. It’s fast and hassle-free, with no sign-up required."
    },
    {
        title: "Select and connect",
        text: "Doctors respond in minutes. Select your preferred one and start your virtual consultation right from your web browser"
    },
    {
        title: "7-day free follow-up chat",
        text: "You have 7 days to follow up with the doctor on any questions you may have"
    },
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
                                How does it work?
                            </h2>
                            <p className="mt-3 text-lg text-primary mb-5 md:text-lg">
                                99% of our users solve their issue within 1 hour. No waiting, no language barriers, no insurance needed
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
                        {data.map((data, index) => (
                            <div key={index} className="my-5">
                                <h4 className="font-bold text-xl mb-2">{data.title}</h4>
                                <p>{data.text}</p>
                            </div>
                        ))}

                        {/* CTA Button */}
                        <div className="text-center lg:text-start mt-8">
                            <Button2 text="Start a Treatment" href="/appointment" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default BulletSection;
