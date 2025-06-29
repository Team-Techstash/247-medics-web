"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const HeroHowItWorks = () => {
    return (
        <section className="bg-white p-4 md:p-7 pt-0">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-light2 py-8 md:py-12 px-2 md:px-10 rounded-2xl relative overflow-hidden">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center md:text-start py-4 px-5 md:p-0 md:pr-20"
                        >
                            <h1 className="text-2xl md:text-4xl 2xl:text-6xl font-bold text-primary leading-tight">
                                When you're far from your doctor
                            </h1>
                            <p className="mt-3 text-primary max-w-150">
                                24/7 Medics helps you schedule appointments online or in-person with local doctors who understand you and can help you today.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="bg-white p-5 md:p-10 rounded rounded-2xl">
                                <Image
                                    src="/images/logo.svg"
                                    alt="Doctor"
                                    width={200}
                                    height={75}
                                    className="w-40 mb-8 mx-auto"
                                />
                                <h5 className="font-bold text-lg md:text-2xl mb-4">What brings you in?</h5>
                                <div className="-mx-5 md:-mx-10">
                                    <div className="flex items-center justify-between bg-light px-5 md:px-10 py-3">
                                        <p><strong>Get Urgent Care</strong> - Get care quickly. 24/7</p>
                                        <Link href={''}>
                                            <Image
                                                src="/images/question.svg"
                                                alt="Doctor"
                                                width={35}
                                                height={35}
                                            />
                                        </Link>
                                    </div>
                                    <div className="flex items-center justify-between px-5 md:px-10 py-3">
                                        <p><strong>Schedule an appointment</strong> - for non urgent needs</p>
                                        <Link href={''}>
                                            <Image
                                                src="/images/question.svg"
                                                alt="Doctor"
                                                width={35}
                                                height={35}
                                            />
                                        </Link>
                                    </div>
                                    <div className="flex items-center justify-between bg-light px-5 md:px-10 py-3">
                                        <p><strong>Prescription refill</strong> - Quickly renew your medication</p>
                                        <Link href={''}>
                                            <Image
                                                src="/images/question.svg"
                                                alt="Doctor"
                                                width={35}
                                                height={35}
                                            />
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default HeroHowItWorks;
