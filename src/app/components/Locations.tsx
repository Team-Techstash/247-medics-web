"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const conditions = [
    "Doctors in France",
    "Doctors in Germany",
    "Doctors in Spain",
    "Doctors in Paris",
    "Doctors in Berlin\n",
    "Doctors in Barcelona\n",
    "Doctors in Marseille\n",
    "Doctors in Cologne\n",
    "Doctors in Madrid\n",
    "Doctors in Lyon\n",
    "Doctors in Nuremberg\n",
    "Doctors in Malaga\n",
    "Doctors in Toulouse\n",
    "Doctors in Munich\n",
    "Doctors in Valencia\n",
    "Doctors in Bordeaux\n",
    "Doctors in Hamburg\n",
    "Doctors in Seville",
    "Doctors in Strasbourg",
    "Doctors in Dusseldorf\n",
    "Doctors in Frankfurt",
];

const Locations = () => {
    return (
        <section className="relative bg-light py-8 px-6 lg:py-16">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-center text-2xl md:text-4xl 2xl:text-6xl font-medium text-primary mb-8 md:mb-18">
                        Popular locations
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-3 mb-10">
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
                </motion.div>
            </div>
        </section>
    );
};

export default Locations;
