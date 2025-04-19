"use client";

import { motion } from "framer-motion";

const CTA2 = () => {
    return (
        <section className="relative p-6">
            <div className="bg-primary rounded-2xl py-10 px-4 xl:py-20 xl:px-6">
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="grid sm:grid-cols-3 gap-12 items-center">
                            <div className="text-white text-lg text-center">
                                <p className="mb-2">Care + Prescription</p>
                                <h4 className="text-2xl md:text-4xl 2xl:text-6xl font-medium mb-0 md:mb-3">$22</h4>
                                <p className="text-sm md:text-lg">Starting from</p>
                            </div>
                            <div className="text-white text-lg text-center">
                                <p className="mb-2">Availability</p>
                                <h4 className="text-2xl md:text-4xl 2xl:text-6xl font-medium mb-0 md:mb-3">24/7</h4>
                                <p className="text-sm md:text-lg">For urgent care online</p>
                            </div>
                            <div className="text-white text-lg text-center">
                                <p className="mb-2">Response time</p>
                                <h4 className="text-2xl md:text-4xl 2xl:text-6xl font-medium mb-0 md:mb-3">5 mins</h4>
                                <p className="text-sm md:text-lg">For urgent care online</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CTA2;
