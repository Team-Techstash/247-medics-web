"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const categories = [
    {
        title: "Women's and Men's Health",
        image: "/images/Health.jpg",
        conditions: [
            { name: "Urinary Tract Infections (UTI)", price: "$20-$40" },
            { name: "Vaginal Yeast Infections", price: "$20-$40" },
            { name: "Bacterial Vaginosis", price: "$20-$40" },
            { name: "Menstrual Problems", price: "$20-$40" },
            { name: "Birth Control - Contraception", price: "$20-$30" },
            { name: "Chlamydia Treatment", price: "$20-$30" },
            { name: "Gonorrhoea Treatment", price: "$20-$30" },
            { name: "ED Treatment", price: "$20-$30" },
            { name: "Prostatitis", price: "$20-$40" },
        ],
    },
    {
        title: "General Illness",
        image: "/images/General-Illness.jpg",
        conditions: [
            { name: "URIs (Chest Cold)", price: "$20-$40" },
            { name: "Allergies", price: "$20-$40" },
            { name: "Mild Asthma", price: "$20-$40" },
            { name: "Cough / Bronchitis", price: "$20-$40" },
            { name: "Flu Symptoms", price: "$20-$40" },
            { name: "Common Cold", price: "$20-$30" },
            { name: "Fever", price: "$20-$50" },
            { name: "Pink Eye (Conjunctivitis)", price: "$20-$30" },
            { name: "Stye / Hordeolum", price: "$20-$30" },
            { name: "Heat Exhaustion", price: "$20-$30" },
            { name: "Dizziness / Vertigo", price: "$20-$30" },
            { name: "Headache", price: "$20-$30" },
            { name: "Travel Medicine Consultation", price: "$40-$60" }
        ],
    },
    {
        title: "Skin Problems",
        image: "/images/Skin-Problems.jpg",
        conditions: [
            { name: "Cold Sores", price: "$20-$30" },
            { name: "Acne", price: "$20-$40" },
            { name: "Eczema / Rash", price: "$20-$40" },
            { name: "Skin Infection / Cellulitis", price: "$20-$50" },
            { name: "Insect / Tick Bites", price: "$20-$30" },
            { name: "Fungal Infections", price: "$20-$30" },
            { name: "Scabies", price: "$20-$30" },
            { name: "Hives", price: "$20-$30" },
            { name: "Impetigo", price: "$20-$30" },
            { name: "Sunburn", price: "$20-$30" },
            { name: "Rosacea Treatment", price: "$20-$30" },
            { name: "Minor Lacerations", price: "$20-$30" },
            { name: "Blisters", price: "$20-$30" },
            { name: "Itching", price: "$20-$30" },
            { name: "Shingles", price: "$20-$30" },
            { name: "Jellyfish Sting", price: "$20-$30" }

        ],
    },
    {
        title: "Ear, Nose and Throat",
        image: "/images/Ear-nose-throat.jpg",
        conditions: [
            { name: "Sinus Infection / Headache", price: "$20-$30" },
            { name: "Ear Infection / Ear Ache", price: "$20-$40" },
            { name: "Swimmer's Ear", price: "$20-$40" },
            { name: "Sore Throat (Pharyngitis)", price: "$20-$40" },
            { name: "Strep Throat", price: "$20-$40" },
            { name: "Hoarseness / Voice Disorder / Laryngitis", price: "$20-$40" },
            { name: "Ear Fullness / Popping", price: "$20-$30" },
            { name: "Nasal Congestion", price: "$20-$30" },
            { name: "Enlarged / Inflamed Tonsils", price: "$20-$30" }
        ],
    },
    {
        title: "Stomach (GI)",
        image: "/images/Stomach.jpg",
        conditions: [
            { name: "Food Allergy / Intolerance", price: "$30-$50" },
            { name: "Irritable Bowel Syndrome (IBS)", price: "$30-$50" },
            { name: "Acid Reflux / Heartburn", price: "$20-$30" },
            { name: "Nausea / Vomit", price: "$20-$40" },
            { name: "Food Poisoning", price: "$30-$50" },
            { name: "Diarrhea", price: "$20-$40" },
            { name: "Constipation", price: "$20-$30" },
            { name: "Mouth Sores", price: "$20-$30" },
            { name: "Upset Stomach (Dyspepsia)", price: "$20-$30" },
            { name: "Stomach Flu (Gastroenteritis)", price: "$20-$30" }
        ],
    },
    {
        title: "Musculoskeletal",
        image: "/images/Muscoloskeletal.jpg",
        conditions: [
            { name: "Foot Pain", price: "$20-$40" },
            { name: "Foot Blisters", price: "$20-$40" },
            { name: "Gout", price: "$20-$30" },
            { name: "Heel Pain", price: "$20-$30" },
            { name: "Achilles Tendinitis", price: "$20-$30" },
            { name: "Ankle Injuries / Minor Sprain", price: "$30-$50" },
            { name: "Athlete's Foot", price: "$20-$30" },
            { name: "Contusions", price: "$20-$30" },
            { name: "Leg Pain / Swelling", price: "$20-$40" },
            { name: "Leg Cramps", price: "$20-$30" },
            { name: "Tendon Inflammation", price: "$20-$30" }
        ],
    },
    {
        title: "Childrens' Health",
        image: "/images/Childrens-Health.jpg",
        conditions: [
            { name: "Child with Fever", price: "$30-$50" },
            { name: "Mild Croup", price: "$30-$50" },
            { name: "Common Cold", price: "$20-$30" },
            { name: "Hay Fever", price: "$20-$30" },
            { name: "Cough", price: "$20-$40" },
            { name: "Strep Throat", price: "$20-$40" },
            { name: "Constipation", price: "$20-$30" },
            { name: "Nasal Congestion", price: "$20-$30" },
            { name: "Earache", price: "$20-$30" },
            { name: "Pink Eye (Conjunctivitis)", price: "$20-$30" }
        ],
    },
    {
        title: "Prescription Renewals",
        image: "/images/Prescription-Renewals.jpg",
        conditions: [
            { name: "Blood Pressure Medications", price: "$20-$35" },
            { name: "Diabetes Medications", price: "$20-$35" },
            { name: "Cholesterol Medications", price: "$20-$35" },
            { name: "Thyroid Medications", price: "$20-$40" },
            { name: "Asthma Inhalers", price: "$20-$40" },
            { name: "Antibiotics", price: "$20-$40" },
            { name: "Birth Control Pill", price: "$20-$30" },
            { name: "Allergy Medications", price: "$20-$30" },
            { name: "Anti-inflammatory Medications", price: "$20-$30" },
            { name: "Malaria Prevention Pill", price: "$20-$30" },
            { name: "EpiPens", price: "$20-$30" }
        ],
    },
];

const PriceList = () => {
    return (
        <section className="relative bg-light py-10 px-6 lg:py-20">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="container mx-auto">
                <div className="mb-10">
                    <h4 className="font-bold text-xl mb-3">
                        With Doctorsa, you’ll always know the cost of your appointment upfront.
                    </h4>
                    <p className="mb-6">
                        Within minutes of submitting your request, you’ll receive offers from doctors who can help you, each setting their own fees, giving you a range of options. The prices below show average costs for common conditions.
                    </p>
                </div>

                {/* Loop Start Here */}
                {categories.map((category, index) => (
                    <div key={index} className="mb-8">
                        {/* Category Title */}
                        <div className="bg-primary text-white px-5 py-4 md:px-10 md:py-5 rounded-t-xl">
                            <h3 className="text-lg md:text-2xl font-bold">{category.title}</h3>
                        </div>

                        {/* Content */}
                        <div className="bg-white p-0 md:px-10 md:py-10 rounded-b-xl">
                            <div className="flex flex-col md:flex-row-reverse md:gap-5 md:gap-12">
                                {/* Image */}
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="w-full md:w-1/2"
                                >
                                    <Image
                                        src={category.image}
                                        alt={category.title}
                                        width={500}
                                        height={350}
                                        className="md:rounded-xl shadow-lg w-full h-auto"
                                    />
                                </motion.div>

                                {/* Conditions & Prices */}
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="w-full md:w-1/2 p-5 md:p-0"
                                >
                                    {category.conditions.map((condition, idx) => (
                                        <div key={idx} className="md:flex items-center justify-between py-1">
                                            <div className="flex items-center gap-2 text-primary xl:text-xl">
                                                <span className="w-7 h-7 rounded-full flex align-center justify-center">
                                                    <Image
                                                        src="/images/arrow-up2.svg"
                                                        alt="Arrow"
                                                        width={10}
                                                        height={10}
                                                    />
                                                </span>
                                                <p className="truncate">{condition.name}</p>
                                            </div>
                                            <p className="ps-9 md:ps-0">{condition.price}</p>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                ))}
                {/* Loop Ends Here */}
                <p className="mb-8">The fees listed are expressed as average price ranges, and individual doctors set their own fees. As a result, the final cost may vary depending on the doctor providing the appointment. Please note that prices are subject to change based on the specific doctor’s rates.</p>
                <h1 className="text-2xl md:text-4xl 2xl:text-6xl font-bold text-primary leading-tight mb-8">
                    Cost of an Online Doctor's <br/>Appointment
                </h1>
                <p>Virtual Doctor Appointments Without Insurance​
                    <br/>
                    <br/>
                    Telehealth services without insurance can be very affordable. The fee for an online medical consultation starts from $20 for a quick online consultation, ideal for urgent care needs. Prices vary from doctor to doctor depending on their years of experience, city, and speciality.
                    <br/>
                    <br/>
                    online doctor visit with insurance
                    You can use your travel or health insurance to pay for your 24/7 Medics consultation. It’s pretty straightforward. When you’re ready to check out, you’ll see an option to select your insurance carrier and enter your policy details.
                    <br/>
                    <br/>
                    24/7 Medics works directly with many insurance providers. But even if your provider isn’t on that list, don’t worry! We’ll spend up to a week trying to arrange direct coverage for you. This means you might not have to pay anything out of pocket.
                    <br/>
                    <br/>
                    The cost of your consultation will be temporarily held at checkout. Then, once your insurance provider confirms they’ll cover it, that hold is lifted. It’s our way of making sure you get the care you need without the upfront costs. </p>
            </motion.div>
        </section>
    );
};

export default PriceList;