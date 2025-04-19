"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Button from "./Button";

const faqItems = [
    { question: "Do Doctors Speak English?", answer: "Yes, all doctors are verified for English proficiency." },
    { question: "How Does It Work?", answer: "You book an appointment online and get connected with a doctor." },
    { question: "How Much Does It Cost?", answer: "Prices vary, starting at $XX per consultation." },
    { question: "Are doctors available on weekends", answer: "Prices vary, starting at $XX per consultation." },
    { question: "Can I get antibiotics without seeing a doctor in-person?", answer: "Prices vary, starting at $XX per consultation." },
    { question: "Is 24/7 Medics for Life-Threatening Conditions?", answer: "Prices vary, starting at $XX per consultation." },
    { question: "Can I get controlled substances on  24/7 Medics?", answer: "Prices vary, starting at $XX per consultation." },
    { question: "Can I contact the doctor for follow-up questions after the consultation?", answer: "Prices vary, starting at $XX per consultation." },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="bg-light p-6 md:p-12 pt-20">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="container mx-auto">
                <div className="grid xl:grid-cols-12 xl:gap-4">
                    <div className="xl:col-span-10 xl:col-start-2">
                        <h2 className="text-2xl md:text-4xl 2xl:text-6xl font-bold text-center text-primary mb-5">Your Questions Answered</h2>
                        <p className="text-center text-primary mb-8">Unsure if it will work for you? Seems too good to be true? We get it! <br/>
                            Sometimes, getting started is the hardest part. Find out what it costs, how long it takes, and what to expect.
                            We’re here to help you be in control of your health while traveling the world.</p>
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
                        <div className="md:flex items-center justify-between py-12 text-center md:text-start">
                            <div className="mb-4 md:mb-0">
                                <h2 className="text-2xl md:text-4xl font-bold text-primary mb-3">More questions?</h2>
                                <p className="text-primary">Unsure if it will work for you? Seems too good to be true? We get it!</p>
                            </div>
                            <div>
                                <Button text="Help Center" href="/appointment" style="primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default FAQ;