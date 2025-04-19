"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const CardHorizontal = () => {
    return (
        <section className="relative bg-light py-10 xl:py-20 px-6">
            <div className="container mx-auto">
                <div className="md:flex md:gap-12 md:py-4">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full md:w-1/2"
                    >
                        <div className="mb-12">
                            <h2 className="text-2xl md:text-4xl font-medium text-primary mb-1 xl:mb-6">
                                Who is an Online Doctor?
                            </h2>
                            <p>Online doctors are just regular licensed physicians who deliver healthcare, including drug prescriptions, over the internet, using video chat.</p>
                        </div>
                        <div className="mb-12">
                            <h2 className="text-2xl md:text-4xl font-medium text-primary mb-1 xl:mb-6">
                                How a Virtual Doctor Visit Work
                            </h2>
                            <p>Instead of going to a clinic or hospital, you can consult a doctor online right away from your hotel, B&B, or even while you’re on the move. <br/>
                                Using video conferencing, you can connect with a doctor in just a few minutes. <br/>
                                Nothing complicated. No sign-up or login required. <br/>
                                Simply visit 24/7medics.com, describe your symptoms, and answer a few questions. Soon, you’ll be talking to a doctor who speaks your language.<br/>
                                Together, you’ll discuss your concerns and find the best treatment plan.<br/>
                                Plus, you’ll have a 7-day free follow-up chat with the doctor to adjust the treatment if needed.</p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full md:w-1/2"
                    >
                        <div className="mb-12">
                            <h2 className="text-2xl md:text-4xl font-medium text-primary mb-1 xl:mb-6">
                                Benefits of an Online Doctor Consultation
                            </h2>
                            <ul className="list-disc list-inside mb-4">
                                <li>Eliminate Travel Time and Hassle</li>
                                <li>Super Fast Response 24/7/365</li>
                                <li>Talk to an English-Speaking Doctor</li>
                                <li>Ease of Mind and Reduced Stress</li>
                                <li>Perfect for Minor Ailments and Forgotten Medication</li>
                                <li>Not Suitable for Life Threatening Conditions</li>
                            </ul>
                            <p>Online doctor visits are perfect for travelers, saving you time and hassle while on holiday. No need for transportation or dealing with local clinics. Unlike limited retail clinics, platforms like 24/7 Medicshandle many medical issues. They reduce stress by connecting you with English-speaking doctors, ensuring clear communication and personalized care without language barriers.</p>
                        </div>
                    </motion.div>
                </div>
                <div className="md:flex flex-col md:flex-row-reverse md:gap-12 items-center md:py-4 xl:-mt-22">
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
                            <h2 className="text-2xl md:text-4xl font-medium text-primary mb-1 xl:mb-6">
                                How Online Doctors Can Assist Tourists
                            </h2>
                            <p>Online doctor visits can be a game-changer for tourists who are usually on tight schedules and unfamiliar with local healthcare. Platforms like 24/7 Medics make it super fast and easy to see a doctor remotely. If you face unexpected health issues far from home, you can quickly talk with a doctor online and get the medical advice or prescriptions you need right away, keeping your travel plans on track and worry-free.</p>
                        </div>
                    </motion.div>
                </div>
                <h2 className="text-2xl md:text-4xl xl:text-5xl font-medium text-primary mb-1 xl:mb-6">
                    Available Online Doctor Services
                </h2>
                <div className="md:flex md:gap-12 md:py-4">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full md:w-1/2"
                    >

                        <div className="mb-12">
                            <h2 className="text-2xl md:text-4xl font-medium text-primary mb-1 xl:mb-6">
                                Online Virtual Visits
                            </h2>
                            <p>Online doctor consultations let you talk about your symptoms, concerns, and medical history with a licensed physician right from your place. These virtual visits give you personalized attention and advice tailored to your needs. Whether you have a non-emergency illness, need a medication refill, or want general healthcare advice, online doctors can provide thorough consultations.</p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full md:w-1/2"
                    >
                        <div className="mb-12">
                            <h2 className="text-2xl md:text-4xl font-medium text-primary mb-1 xl:mb-6">
                                Express Prescriptions
                            </h2>
                            <p>Online doctors can, in many cases, give you prescriptions after virtual care.  Once you complete your online consultation, you receive a copy of the prescription so you can pick it up at the closest pharmacy. This is especially great for travelers who need quick access to meds while they’re away from their usual doctor.</p>
                        </div>
                    </motion.div>
                </div>
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >

                        <div className="mb-12">
                            <h2 className="text-2xl md:text-4xl font-medium text-primary mb-1 xl:mb-6">
                                Follow-up Care on the Go
                            </h2>
                            <p>Unlike emergency rooms, where follow-up isn’t possible, online doctors offer ongoing monitoring and follow-up. With online doctor services, you get continued support and guidance during your treatment or recovery. 24/7 Medics provides free follow-up chat for 7 days, letting you check in with the same provider who initially evaluated you. This continuity of care ensures your progress is closely monitored, and any necessary adjustments or recommendations are made promptly.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CardHorizontal;
