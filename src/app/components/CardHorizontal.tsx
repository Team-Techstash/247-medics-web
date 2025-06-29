"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button2 from "./Button2";

const CardHorizontal = () => {
    return (
        <section className="relative bg-light py-10 xl:py-10 px-6">
            <div className="container mx-auto">
                <div className="md:flex flex-col md:flex-row-reverse md:gap-12 items-center md:py-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full md:w-1/2"
                    >
                        <Image
                            src="/images/cardImage1.svg" // Replace with actual image
                            alt="Doctor Consultation"
                            width={525}
                            height={525}
                            className="mx-auto w-80 md:w-auto md:ml-auto my-4 md:my-0"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full md:w-1/2"
                    >
                        <div className="mb-12">
                            <span className="inline-block bg-secondary text-white font-bold uppercase md:text-lg py-2 px-4 md:px-8 md:py-4 rounded rounded-full mb-3 md:mb-6">STEP 1</span>
                            <h2 className="text-2xl md:text-4xl 2xl:text-6xl font-medium text-primary mb-1 xl:mb-6">
                                Answer some questions
                            </h2>
                            <p>We’ll need you to fill out a quick intake form to let us know your needs. This will only take a few minutes. No sign-up required.</p>
                            <div className="bg-primary text-white rounded rounded-xl p-6 md:px-12 md:py-8 mt-5">
                                <p><strong>Pro Tip</strong><br/>
                                    Get specific in describing your need, so that only doctors who are the right fit will offer you an appointment. Your personal data are anonymized until you select a provider.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
                <div className="md:flex gap-6 md:gap-12 items-center md:py-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full md:w-1/2"
                    >
                        <Image
                            src="/images/cardImage2.svg" // Replace with actual image
                            alt="Doctor Consultation"
                            width={525}
                            height={525}
                            className="mx-auto w-80 md:w-auto md:ml-start my-4 md:my-0"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full md:w-1/2"
                    >
                        <div className="mb-12">
                            <span className="inline-block bg-secondary text-white font-bold uppercase md:text-lg py-2 px-4 md:px-8 md:py-4 rounded rounded-full mb-3 md:mb-6">STEP 2</span>
                            <h2 className="text-2xl md:text-4xl 2xl:text-6xl font-medium text-primary mb-1 xl:mb-6">
                                Pick your doctor
                            </h2>
                            <p>24/7 Medics will send appointment options and you’ll be notified via WhatsApp, where you’ll receive a viewing link <br/><br/>
                                Compare prices, see reviews, then choose what works best for you. <br/><br/>
                                Pay online with credit card or PayPal. No insurance needed.</p>
                            <div className="bg-primary text-white rounded rounded-xl p-6 md:px-12 md:py-8 mt-5">
                                <p><strong>Pro Tip</strong><br/>
                                    The offers expire quickly as doctors get booked. When you see an option that works for you, don't wait. Book it right away!</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
                <div className="md:flex flex-col md:flex-row-reverse md:gap-12 items-center md:py-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full md:w-1/2"
                    >
                        <Image
                            src="/images/cardImage3.svg" // Replace with actual image
                            alt="Doctor Consultation"
                            width={525}
                            height={525}
                            className="mx-auto w-80 md:w-auto md:ml-auto my-4 md:my-0"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full md:w-1/2"
                    >
                        <div className="mb-12">
                            <span className="inline-block bg-secondary text-white font-bold uppercase md:text-lg py-2 px-4 md:px-8 md:py-4 rounded rounded-full mb-3 md:mb-6">STEP 3</span>
                            <h2 className="text-2xl md:text-4xl 2xl:text-6xl font-medium text-primary mb-1 xl:mb-6">
                                Connect with your doctor
                            </h2>
                            <p>Video visits are available 24/7, just minutes after booking.
                                <br/>
                                <br/>
                                Click the link you’ll receive to start your video visit in your browser.
                                <br/>
                                <br/>
                                Prescriptions will be sent to you via email. You can contact your clinician with follow-up questions for free within 7 days.
                                <br/>
                                <br/>
                                In-person appointments for non-urgent needs are available in select cities.</p>
                            <div className="bg-primary text-white rounded rounded-xl p-6 md:px-12 md:py-8 mt-5">
                                <p><strong>Pro Tip</strong><br/>
                                    Get specific in describing your need, so that only doctors who are the right fit will offer you an appointment. Your personal data are anonymized until you select a provider.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
                <div className="text-center">
                    <Button2 text="See a doctor" href="/create-appointment" />
                </div>
            </div>
        </section>
    );
};

export default CardHorizontal;
