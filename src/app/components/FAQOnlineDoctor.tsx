"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const faqItems = [
    { question: "Can I talk to the doctor online?", answer: "Yes, all doctors are verified for English proficiency." },
    { question: "Can I get a prescription online without seeing the doctor?", answer: "You book an appointment online and get connected with a doctor." },
    { question: "How much does a virtual appointment with 24/7 Medics cost?", answer: "Prices vary, starting at $XX per consultation." },
    { question: "How do I get a script from an online doctor?", answer: "Prices vary, starting at $XX per consultation." },
    { question: "Is an online doctor for me?", answer: "Prices vary, starting at $XX per consultation." },
    { question: "Are online virtual doctors available on weekends", answer: "Prices vary, starting at $XX per consultation." },
    { question: "Can I get antibiotics without seeing a doctor in-person?", answer: "Prices vary, starting at $XX per consultation." },
    { question: "How Doctors a protects my health information?", answer: "Prices vary, starting at $XX per consultation." },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="bg-light p-6 md:p-12 pt-20">
            <div className="container mx-auto">
                <div className="grid xl:grid-cols-12 xl:gap-4">
                    <div className="xl:col-span-10 xl:col-start-2">
                        <h2 className="text-2xl md:text-4xl 2xl:text-6xl font-bold text-center text-primary mb-18">Your Questions Answered</h2>
                        <div className="mt-6 space-y-4">
                            {faqItems.map((item, index) => {
                                const isOpen = openIndex === index;
                                return (
                                    <div key={index} className="relative border rounded-lg py-4 px-6 shadow-2xl shadow-primary/10 bg-white">
                                        <button
                                            onClick={() => setOpenIndex(isOpen ? null : index)}
                                            className="flex justify-between w-full text-md lg:text-lg font-medium text-primary cursor-pointer outline-0 text-start"
                                        >
                                            {item.question}
                                            <motion.span
                                                animate={{ rotate: isOpen ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex align-center ms-3"
                                            >
                                                {isOpen ?
                                                    <Image
                                                        src="/images/minus.svg"
                                                        alt=""
                                                        width={22}
                                                        height={22}
                                                    />
                                                    :
                                                    <Image
                                                        src="/images/plus.svg"
                                                        alt=""
                                                        width={22}
                                                        height={22}
                                                    />}
                                            </motion.span>
                                        </button>
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <p className="mt-2 text-primary">{item.answer}</p>
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;