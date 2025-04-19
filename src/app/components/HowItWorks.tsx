"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const HowItWorks = () => {
    return (
        <section className="relative bg-light py-12 px-6 md:py-20">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center mb-10">
                    <h2 className="text-2xl md:text-4xl 2xl:text-6xl font-medium text-primary mb-3">
                        How does it work?
                    </h2>
                    <p className="mt-3 text-md md:text-lg text-primary mb-5 md:w-2/3 mx-auto">
                        90% of our users solve their issue within 1 hour. Want to know <br/>how? Real doctors respond within minutes, offering video consultations. No waiting, no language barriers, no insurance needed.
                    </p>
                </motion.div>
                <div className="grid md:grid-cols-2 gap-6 relative">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex h-full"
                    >
                        <div className="bg-white rounded-lg p-8 lg:p-10 lg:py-15 shadow-2xl shadow-primary/20">
                            <div className="relative mb-8">
                                <Image
                                    src='/images/number.svg'
                                    alt=''
                                    width={77}
                                    height={60}
                                />
                                <span className="text-white absolute top-4 left-6 text-2xl font-bold">01</span>
                            </div>
                            <h4 className="text-primary text-xl md:text-2xl 2xl:text-4xl font-medium mb-3">Send your request</h4>
                            <p className="text-primary xl:w-1/2">Got a medical concern? Send your request explaining what you need—like "I have a sore throat and need antibiotics quickly".</p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex h-full"
                    >
                        <div className="bg-white rounded-lg p-8 lg:p-10 lg:py-15 shadow-2xl shadow-primary/20 md:text-right">
                            <div className="relative mb-8 md:ml-auto md:inline-block">
                                <Image
                                    src='/images/number.svg'
                                    alt=''
                                    width={77}
                                    height={60}
                                />
                                <span className="text-white absolute top-4 left-6 text-2xl font-bold">02</span>
                            </div>
                            <h4 className="text-primary text-xl md:text-2xl 2xl:text-4xl font-medium mb-3">Check your options</h4>
                            <p className="text-primary xl:w-1/2 md:ml-auto">Within minutes, receive personalized responses from qualified doctors based on your medical and time needs.</p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex h-full"
                    >
                        <div className="bg-white rounded-lg p-8 lg:p-10 lg:py-15 shadow-2xl shadow-primary/20">
                            <div className="relative mb-8">
                                <Image
                                    src='/images/number.svg'
                                    alt=''
                                    width={77}
                                    height={60}
                                />
                                <span className="text-white absolute top-4 left-6 text-2xl font-bold">03</span>
                            </div>
                            <h4 className="text-primary text-xl md:text-2xl 2xl:text-4xl font-medium mb-3">Choose and book</h4>
                            <p className="text-primary xl:w-1/2 md:ml-auto">Compare prices, view doctors' bios, credentials, and reviews, choose your preferred doctor, and pay online with a credit card.</p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex h-full"
                    >
                        <div className="bg-white rounded-lg p-8 lg:p-10 lg:py-15 shadow-2xl shadow-primary/20 md:text-right">
                            <div className="relative mb-8 md:ml-auto md:inline-block">
                                <Image
                                    src='/images/number.svg'
                                    alt=''
                                    width={77}
                                    height={60}
                                />
                                <span className="text-white absolute top-4 left-6 text-2xl font-bold">04</span>
                            </div>
                            <h4 className="text-primary text-xl md:text-2xl 2xl:text-4xl font-medium mb-3">You're all set!</h4>
                            <p className="text-primary xl:w-1/2 md:ml-auto">A few minutes after the visit, your doctor will send you an email. Head to a nearby pharmacy of your choice and you're all done.</p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden lg:block"
                    >
                        <Image
                            src='/images/mobile.png'
                            alt=''
                            width={400}
                            height={660}
                            className="w-80 lg:w-90"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
