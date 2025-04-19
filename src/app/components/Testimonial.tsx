"use client";

import Image from "next/image";
import {motion} from "framer-motion";


export default function Testimonial() {
    return (
        <section className="p-6">
            <div className="bg-primary text-white p-6 md:p-12 rounded-3xl flex flex-col md:flex-row items-center md:items-start gap-6 shadow-lg overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="container mx-auto">
                    <div className="grid xl:grid-cols-2 items-center">
                        <div className="mb-6 xl:mb-0">
                            <h2 className="text-2xl md:text-4xl 2xl:text-5xl font-bold leading-tight">More Than 30,000,000 <br/>Minutes Saved
                                To 90,000 <br/>Satisfied Patients</h2>
                            <p className="mt-2 xl:text-lg">Don't Let A UTI Ruin Your Vacation!</p>
                        </div>
                        <div className="pr-5 md:pr-50 relative">
                            <div className="relative bg-white text-gray-800 rounded-2xl p-5 lg:p-10 xl:pe-20 shadow-md">
                                <span className="absolute top-3 right-[-30px] flex item-center justify-center bg-secondary p-3 rounded-full block w-15 h-15 border border-white">
                                      <Image
                                          src='/images/quote.svg'
                                          alt=''
                                          width={43}
                                          height={28}
                                      />
                                </span>
                                <p className="lg:text-lg xl:pr-20">i had just arrived in Spain and had no clue on where to go and how to see
                                    a doctor. 24/7 Medics was fantastic during the time of need, got my meds in 30 min!</p>
                                <hr className="my-8 border-gray-300"/>

                                <div className="flex items-center gap-4">
                                    <Image
                                        src='/images/avatar.png'
                                        alt=''
                                        width={50}
                                        height={50}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <p className="text-lg font-bold">Tamara</p>
                                        <p className="text-gray-500 mb-0">Parent of a young learner</p>
                                    </div>
                                </div>
                            </div>
                            <Image
                                src='/images/pills.png'
                                alt=''
                                width={350}
                                height={28}
                                className="absolute -right-24 -bottom-10 hidden md:block"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
