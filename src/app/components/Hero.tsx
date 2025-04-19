"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button2 from "./Button2";

const Hero = () => {
    return (
        <section className="bg-white p-4 md:p-7 pt-0">
            <div className="bg-light2 md:py-28 md:px-10 rounded-2xl relative overflow-hidden">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="md:absolute right-0 top-0 h-full"
                        >
                            <Image
                                src="/images/hero.jpg"
                                alt="Doctor"
                                width={500}
                                height={500}
                                className="w-full h-60 md:h-full object-cover object-center md:object-right"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative z-2 text-center md:text-start py-8 px-5 md:p-0"
                        >
                            <h1 className="text-2xl md:text-4xl 2xl:text-6xl font-bold text-primary leading-tight">
                                24/7 Medics <br className="hidden md:block" /> Care Anywhere, <br /> Anytime!
                            </h1>
                            <p className="mt-3 mb-10 text-primary max-w-150">
                                Providing innovative medical services and solutions to healthcare
                                professionals and patients worldwide.
                            </p>
                            <Button2 text="Find a treatment" href="/appointment" />

                            <div className="mt-6 text-center md:text-start">
                                <Image src="/images/trustpilot2.png" alt="Trustpilot" width={200} height={100} className="w-40 inline-block xl:w-52" />
                            </div>
                        </motion.div>
                    </div>
                </div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex items-center absolute left-[10%] top-[20%] md:left-[40%] md:top-[60%] z-3 bg-white/50 rounded-2xl p-3 md:py-3 md:px-5 backdrop-blur-md">
                    <Image
                        src="/images/users.png"
                        alt="Doctor"
                        width={126}
                        height={70}
                        className="mr-3 h-12 w-auto md:h-20"
                    />
                    <div className="text-primary">
                        <h3 className="text-lg md:text-2xl 2xl:text-4xl font-bold">+500k</h3>
                        <p className="text-sm md:text-md">Satisfied Customers</p>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="flex items-center absolute right-[8%] top-40 z-3 bg-white/50 rounded-2xl py-3 px-5 backdrop-blur-md hidden md:flex">
                    <Image
                        src="/images/library-icon.svg"
                        alt="Doctor"
                        width={44}
                        height={56}
                        className="mr-3 h-auto"
                    />
                    <div className="text-primary">
                        <h3 className="text-lg md:text-2xl 2xl:text-4xl font-bold">+75%</h3>
                        <p className="text-sm md:text-md">medical services and <br/>solutions to healthcare</p>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="absolute right-[3%] bottom-40 z-3 bg-white/50 rounded-2xl py-5 px-5 backdrop-blur-md hidden md:block">
                    <Image
                        src="/images/logo.svg"
                        alt="Doctor"
                        width={230}
                        height={80}
                        className="mr-3 h-10 w-auto 2xl:h-16"
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
