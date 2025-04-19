"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button2 from "./Button2";

const HeroPrices = () => {
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
                            <h1 className="text-2xl md:text-4xl 2xl:text-6xl font-bold text-primary leading-tight mb-4">
                                Online Doctor <br className="hidden md:block"/>
                                Price List
                            </h1>
                            <Image
                                src="/images/trustpiloth.png"
                                alt="Doctor"
                                width={300}
                                height={75}
                                className="mb-8"
                            />
                            <div className="border-t-1 border-top border-secondary/50 py-3 md:py-6 flex items-center gap-4">
                                <Image
                                    src="/images/girl.svg"
                                    alt="Doctor"
                                    width={150}
                                    height={150}
                                    className="w-20 md:w-30"
                                />
                                <div className="text-start">
                                    <h4 className="mt-3 md:text-2xl text-primary max-w-150">Doctor online visit starting at</h4>
                                    <h1 className="text-3xl md:text-4xl 2xl:text-6xl font-bold text-primary leading-tight mb-4">
                                        $20
                                    </h1>
                                </div>
                            </div>
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
                                <h5 className="font-bold text-lg md:text-2xl mb-4">Get immediate care from a licensed doctor.</h5>
                                <ul className="list-disc list-inside mb-4">
                                    <li className="py-2">Video call with a doctor in under 5 minutes</li>
                                    <li className="py-2">Pick-up your medicine from a nearby pharmacy</li>
                                    <li className="py-2">Get 7-day free follow-up via chat.</li>
                                </ul>
                                <div className="text-center md:text-left">
                                    <Button2 text="See an Online Doctor" href="/appointment" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default HeroPrices;
