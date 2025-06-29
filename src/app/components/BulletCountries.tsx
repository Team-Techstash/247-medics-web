"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button2 from "./Button2";

const conditions = [
    "Doctors in Europe",
    "Doctors in Turkey",
    "Doctors in United Kingdom",
    "Doctors in South Africa",
    "Doctors in Vietnam",
    "Doctors in Thailand",
    "Doctors in Canada",
    "Doctors in UAE",
    "Doctors in Mexico",
    "Doctors in Brazil",
];

const BulletCountries = () => {
    return (
        <section className="relative bg-light py-10 xl:py-20 px-6">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Image
                            src="/images/map.png" // Replace with actual image
                            alt="Doctor Consultation"
                            width={500}
                            height={350}
                            className="w-full h-auto"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="md:pl-10 lg:pl-30"
                    >
                        <div className="mb-12">
                            <h2 className="text-2xl md:text-4xl 2xl:text-6xl font-medium text-primary mb-1 xl:mb-3">
                                Doctors in Europe and beyond
                            </h2>
                        </div>
                        {/* Bullet Points Grid */}
                        <div className="mb-8">
                            {conditions.map((condition, index) => (
                                <div key={index} className="flex items-center gap-3 text-primary text-xl my-3">
                                    {condition.trim()
                                        ?
                                        <span className="bg-secondary w-7 h-7 rounded-full flex align-center justify-center">
                                            <Image
                                                src="/images/btn-arrow.svg" // Replace with actual image
                                                alt="Doctor Consultation"
                                                width={10}
                                                height={10}
                                            />
                                        </span> : <div className='h-5'></div>}
                                    <p>{condition}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default BulletCountries;
