"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "./Button";

const faqItems = [
    { question: "Is 24/7 Medics a medical service provider?",
        answer: "24/7 Medics is a digital platform for finding available English-speaking doctors across Europe, United Kingdom, Turkey, Mexico, Brazil, Vietnam and Thailand offering 24/7 immediate video visits to swiftly treat common conditions at a fair price. Moreover, for those seeking in-person consultations, we extend our services to select cities across Europe, ensuring comprehensive healthcare accessibility. \n" +
            "It works as a marketplace. Providers offering their services through 24/7 Medics are completely independent, and patients are free to choose their preferred provider. We do not recommend or refer patients to a particular professional. Rather, we provide a transparent and fair environment where patients can independently choose their doctor." },
    { question: "How do you guarantee that all providers speak English?",
        answer: "We meticulously assess the cultural proficiency and English proficiency of every doctor individually. When a provider seeks to join 24/7 Medics, they undergo a thorough vetting process that includes verifying international experience and English language proficiency." },
    { question: "What is the cost to see a doctor?",
        answer: "Each doctor determines their service fee, which we ensure aligns with local rates. Booking appointments through us remains free of charge, with no additional fees incurred on your end. The cost of a video consultation varies depending on the provider you choose, typically between €15 and €60 for urgent care needs." },
    { question: "How can I stay in touch after the video visit with the doctor?",
        answer: "You have the option to message the doctor with any follow-up questions within 7 days after the consultation. If your queries extend beyond this period, you can conveniently book a new appointment with the same doctor using their dedicated page." },
    { question: "Can I use EHIC to pay or access free public health services?",
        answer: "No, you can only book private services through 24/7 Medics. EHIC or other forms of free or subsidized health assistance are available only at public hospitals or medical centers that are part of the public healthcare system of the country where you are located." },
    { question: "Can I cancel or reschedule an appointment?",
        answer: "You can always ask to reschedule, and the doctor will do everything possible to accommodate your request. Cancelling an appointment is also possible and free of charge, up to 24 hours before the appointment. However, if you need to cancel less than 24 hours before the appointment, no refund will be issued. You may still be able to reschedule, though, so feel free to contact us whenever you need to make a change." },
    { question: "What happens if the doctor cancels my appointment?",
        answer: "Although extremely rare, occasionally a doctor is unable to keep a scheduled appointment. In this case, you’ll be offered a set of options: Choose a different time with the same doctor, pick another available appointment with any of the other doctors on the platform, or receive a full refund." },
    { question: "Do doctors pay to be listed?",
        answer: "No. Doctors do not pay to join the platform, nor do they pay a membership fee. They cannot pay to appear at the top of the list or to be given special visibility. The patient is free to choose among all available professionals. " },
    { question: "Do you vet the providers?",
        answer: "Yes, all providers are vetted for their cultural competence and English language fluency as a first step. Then we verify and confirm that they have an active medical license and are in good standing to practice. We confirm their specialty, education, and any board certifications. A medical professional who has not passed the vetting process can never pay to be included. We then collect direct feedback on the providers from the patients as we aim to keep our standards high." },
];

const FAQ2 = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(1);

    return (
        <section className="bg-light p-6 md:p-12 pt-20">
            <div className="container mx-auto">
                <div className="grid xl:grid-cols-12 xl:gap-4">
                    <div className="xl:col-span-10 xl:col-start-2">
                        <h2 className="text-2xl md:text-4xl 2xl:text-6xl font-bold text-center text-primary mb-5">Your Questions Answered</h2>
                        <p className="text-center text-primary mb-8">A space for sharing our experience by answering questions others like you have asked before.</p>
                        <div className="mt-6 space-y-4">
                            {faqItems.map((item, index) => {
                                return (
                                    <div key={index} className="relative rounded-lg py-4 px-6 shadow-2xl shadow-primary/10 bg-white">
                                        <button
                                            className="flex justify-between w-full text-md lg:text-lg font-medium text-primary cursor-pointer outline-0 text-start"
                                        >
                                            {item.question}
                                        </button>
                                        <motion.div
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
                                <p className="text-primary">Check out the Help Center to learn more.</p>
                            </div>
                            <div>
                                <Button text="Help Center" href="/appointment" style="primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ2;