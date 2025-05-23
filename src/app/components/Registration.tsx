"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "./Button";
import Button3 from "./Button3";
import Link from "next/link";

const sections = [
    {
        title: "General Illness",
        text: "With 24/7 Medics, you can tackle colds, allergies, and infections, keeping you healthy so you can enjoy your trip.",
        image: "/images/General-Illness.jpg",
        list: [
            "Upper Respiratory Infections (URIs)",
            "Urinary Tract Infection (UTI)",
            "Sore Throat / Pharyngitis / Tonsillitis",
            "Seasonal Allergy Treatment",
            "Cough / Bronchitis / Chest Cold",
            "Fever",
            "Flu & Cold Symptoms",
            "Covid",
            "Mild Asthma",
            "Pink Eye / Conjunctivitis",
            "Stye / Hordeolum",
            "Heat Exhaustion",
            "Dizziness / Vertigo",
            "Sinus infection / Headache",
            "Tooth Aches / Dental Pain Relief",
            "Travel Medicine Consultation",
            "Second Opinion",
            "Gout"
        ],
    },
    {
        title: "Skin Problems",
        text: "Our doctors provide treatment for rashes, acne, and infections, helping you resolve skin issues while you’re away from home.",
        image: "/images/Skin-Problems.jpg",
        list: [
            "Cold sores",
            "Tick Bites",
            "Bed Bugs",
            "Insect bites",
            "Acne",
            "Eczema / Rash / Dermatitis",
            "Cellulitis / Skin Infection",
            "Scabies",
            "Shingles",
            "Hives",
            "Impetigo",
            "Sunburn",
            "Rosacea Treatment",
            "Minor Lacerations",
            "Blisters",
            "Jellyfish Sting",
            "Sea Urchin Sting",
            "Fungal Infections",
        ],
    },
    {
        title: "Stomach (GI)",
        text: "Vomiting, nausea, and diarrhea are common among travelers. Our doctors treat these digestive issues, including stomach pain and indigestion, so you can stay comfortable and enjoy local cuisine.",
        image: "/images/Stomach.jpg",
        list: [
            "Diarrhea",
            "Food Poisoning",
            "Food allergy / Intolerance",
            "Stomach Flu / Gastroenteritis",
            "Nausea / Vomit",
            "Acid Reflux / Heartburn / GERD​",
            "Irritable Bowel Syndrome (IBS)",
            "Constipation",
            "Upset Stomach / Dyspepsia",
            "Mouth Sores"
        ],
    },
    {
        title: "Ear, nose, & throat",
        text: "Get treatment for ear infections, sore throats, and sinus issues, offering fast relief for international tourists dealing with ENT problems while abroad.",
        image: "/images/Ear-nose-throat.jpg",
        list: [
            "Ear infection / Ear Ache",
            "Sinus infection / Headache",
            "Ear Fullness / Ear Popping",
            "Nasal Congestion / Runny Nose / Rhinitis",
            "Sore Throat / Pharyngitis / Tonsillitis",
            "Strep Throat",
            "Hoarseness / Voice Disorder / Laryngitis",
            "Swimmer's Ear",
            "Enlarged / Inflamed Tonsils"
        ],
    },
    {
        title: "Muscoloskeletal",
        text: "Doctors treat muscle, joint, and foot pain from injuries or overuse. Stay active and comfortable while exploring new destinations.",
        image: "/images/Muscoloskeletal.jpg",
        list: [
            "Mild injuries (e.g. cuts, bruises)",
            "Foot pain",
            "Foot Blisters",
            "Gout",
            "Tendonitis",
            "Ankle Injuries / Minor Sprain",
            "Leg Pain / Swelling",
            "Leg Cramps",
            "Athlete's foot",
            "Contusions",
            "Pulled Muscles",
            "Neck Pain",
            "Plantar Fasciitis / Heel Pain",
            "Sports Injury"
        ],
    },
    {
        title: "Women's & Men's Health",
        text: "Women’s and men’s health issues can arise unexpectedly while traveling. We provide quick treatment for common concerns. Stay well and enjoy your trip with peace of mind.",
        image: "/images/Health.jpg",
        list: [
            "Birth Control / Contraception",
            "Menstrual problems",
            "STIs Testing (Lab Order)",
            "Vaginal/Penis/Rectal Discharge",
            "Cystitis",
            "Bacterial Vaginosis (BV)",
            "Yeast infection (Thrush)",
            "Herpes",
            "Chlamydia Treatment",
            "Gonorrhoea Treatment",
            "Genital Warts",
            "Period Cramps Relief",
            "Vaginal Dryness Treatment",
            "Menopause Symptoms Treatment",
            "Emergency Contraception",
            "Benign Prostate Enlargement",
            "Erectile Dysfunction (ED)"
        ],
    },
    {
        title: "Children's Health",
        text: "Get prompt care for children’s health issues while traveling, ensuring your little ones stay healthy and enjoy the journey.",
        image: "/images/Childrens-Health.jpg",
        list: [
            "Child with fever",
            "Hay fever",
            "Child With Cough",
            "Common Cold",
            "Strep Throat",
            "Tonsillitis / Sore Throat",
            "Pink Eye / Conjunctivitis",
            "Earache",
            "Nasal Congestion / Runny Nose / Rhinitis",
            "Mild Croup",
            "Constipation"
        ],
    },
    {
        title: "Prescription Renewals",
        text: "Doctors can handle prescription renewals for travelers who run out of medications, forget to pack them, or lose them while away. Not suitable for controlled substances.",
        image: "/images/Prescription-Renewals.jpg",
        list: [
            "Antibiotics (e.g. amoxicillin, azythromycin, ciprofloxacin)",
            "Birth Control / Contraception",
            "Prednisone for allergies and asthma",
            "Acyclovir for herpes",
            "Fluconazole",
            "Metronidazole",
            "Blood Pressure Medications",
            "Diabetes Medications",
            "Cholesterol Medications",
            "Allergy Medications",
            "EpiPens",
            "Thyroid Medications",
            "Anti-inflammatory Medications",
            "Prescription refills for antidepressants (e.g. Lexapro)",
            "Inhaler for asthma",
            "Insomnia Treatment",
            "Malaria Prevention Pill",
            "Anxiety Treatment",
            "Depression Treatment",
            "Migraine Treatment",
            "Treatment for ED"
        ],
    },
];

export default function Registration() {
    return (
        <section className="relative py-10 px-6 2xl:py-18 -mt-18 lg:h-screen flex items-center">
            <Image
                src='/bg.jpg'
                alt=''
                width={100}
                height={100}
                className="fixed lg:absolute top-0 left-0 w-full h-full object-cover object-center"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black/[.5]"></div>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="container mx-auto relative h-full">
                <Image
                    src='/images/logo-white.svg'
                    alt=''
                    width={250}
                    height={100}
                    className="absolute top-0 left-0 w-50 2xl:w-70"
                />
                <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
                    <div className="lg:mt-20 pt-30 md:py-30 text-center lg:text-start">
                        <h2 className="text-4xl md:text-6xl 2xl:text-7xl font-medium text-white mb-10 capitalize">24/7 Medics <br/>Care anywhere, <br/>anytime!</h2>
                        <Button3 text="Continue" href="/appointment" style="primary" />
                    </div>
                    <div className="bg-white rounded rounded-4xl px-6 py-7 2xl:px-10 2xl:py-10 h-full overflow-hidden scroll-m-10 flex flex-col justify-between">
                        <div className="overflow-auto">
                            <h2 className="text-2xl md:text-3xl 2xl:text-5xl font-medium mb-4 2xl:mb-6">Join us today!</h2>
                            <p className="mt-3 text-primary mb-10">Enter the detail below</p>

                            <div className=""> {/*Step 1*/}
                                <div className="mb-8">
                                    <label htmlFor="" className="block mb-3 font-semibold text-sm 2xl:text-lg">Who requires medical attention?</label>
                                    <div className="grid lg:grid-cols-2 gap-4">
                                        <label className="flex items-center border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4  text-sm 2xl:text-lg">
                                            <input type="radio" name="attention" value="me" className="mr-2" />
                                            Me
                                        </label>
                                        <label className="flex items-center border rounded-lg 2xl:rounded-2xl rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 text-sm 2xl:text-lg">
                                            <input type="radio" name="attention" value="someone-else" className="mr-2" />
                                            Someone else
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <div className="grid lg:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="" className="block mb-3 font-semibold text-sm 2xl:text-lg">How old are you?</label>
                                            <input type="text" name="age" value="" className="block w-full border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 hover:bg-primary/[.1] outline-0 text-sm 2xl:text-lg" />
                                        </div>
                                        <div>
                                            <label htmlFor="" className="block mb-3 font-semibold text-sm 2xl:text-lg">Location?</label>
                                            <div className="relative">
                                                <select className="w-full border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 outline-0 appearance-none text-sm 2xl:text-lg">
                                                    <option>Texas City, TX, USA</option>
                                                    <option>Texas, QLD, Australia</option>
                                                    <option>Texas, San Luis Potosi, Mexico</option>
                                                    <option>Texas Creek, CO, USA</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 text-primary"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.292 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <div className="mb-3">
                                        <label htmlFor="" className="block mb-3 font-semibold text-sm 2xl:text-lg">How can the doctor help you?</label>
                                        <textarea className="block w-full border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 hover:bg-primary/[.1] outline-0 text-sm 2xl:text-lg" rows="4" value=""></textarea>
                                    </div>
                                    <small className="block">
                                        Specify symptoms or medication needed so doctors can assist. Your request
                                        is fully anonymized; doctors see only the description. Avoid personal
                                        details.
                                    </small>
                                </div>
                            </div>
                            <div className=""> {/*Step 2*/}
                                <div className="mb-8">
                                    <label htmlFor="" className="block mb-3 font-semibold text-sm 2xl:text-lg">What brings you in?</label>
                                    <div className="flex flex-col gap-4">
                                        <Link href="/" className="border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 font-semibold flex justify-between items-center">
                                            <div className="text-sm 2xl:text-lg">
                                                Get Urgent Care
                                                <span className="block font-normal">Immediate primary care, 24/7</span>
                                            </div>
                                            <Image
                                                src="/images/question-circle.svg"
                                                alt=''
                                                width={30}
                                                height={30}
                                            />
                                        </Link>
                                        <Link href="/" className="border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 font-semibold flex justify-between items-center">
                                            <div className="text-sm 2xl:text-lg">
                                                Set up an appointment
                                                <span className="block font-normal">Same day or later needs</span>
                                            </div>
                                            <Image
                                                src="/images/question-circle.svg"
                                                alt=''
                                                width={30}
                                                height={30}
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className=""> {/*Step 3*/}
                                <div className="mb-8">
                                    <div className="mb-3">
                                        <label htmlFor="" className="block mb-3 font-semibold text-sm 2xl:text-lg">What city are you in?</label>
                                        <input type="text" name="city" value="" className="block w-full border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 hover:bg-primary/[.1] outline-0 text-sm 2xl:text-lg" />
                                    </div>
                                    <small className="block">
                                        Make sure the city you pick is where you need assistance
                                    </small>
                                </div>
                            </div>
                            <div className=""> {/*Step 4*/}
                                <div className="mb-8">
                                    <div className="mb-3">
                                        <label htmlFor="" className="block mb-3 font-semibold text-sm 2xl:text-lg">Your name</label>
                                        <div className="grid lg:grid-cols-2 gap-4">
                                            <div>
                                                <input type="text" name="fname" value="" placeholder="First Name" className="block w-full border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 hover:bg-primary/[.1] outline-0 text-sm 2xl:text-lg" />
                                            </div>
                                            <div>
                                                <input type="text" name="lname" value="" placeholder="Last Name" className="block w-full border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 hover:bg-primary/[.1] outline-0 text-sm 2xl:text-lg" />
                                            </div>
                                        </div>
                                    </div>
                                    <small className="block">
                                        Use your real name to ensure proper care. Your details are shared only with the doctor you choose to book with.
                                    </small>
                                </div>
                                <div className="mb-8">
                                    <label htmlFor="" className="block mb-3 font-semibold text-sm 2xl:text-lg">Sex</label>
                                    <div className="grid lg:grid-cols-2 gap-4">
                                        <label className="flex items-center border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4  text-sm 2xl:text-lg">
                                            <input type="radio" name="sex" value="male" className="mr-2" />
                                            Male
                                        </label>
                                        <label className="flex items-center border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4  text-sm 2xl:text-lg">
                                            <input type="radio" name="sex" value="female" className="mr-2" />
                                            Female
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <label htmlFor="" className="block mb-3 font-semibold text-sm 2xl:text-lg">Your pronouns (optional)</label>
                                    <div className="grid lg:grid-cols-2 gap-4">
                                        <label className="flex items-center border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4  text-sm 2xl:text-lg">
                                            <input type="radio" name="pronouns" value="male" className="mr-2" />
                                            Male
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <label htmlFor="" className="block mb-3 font-semibold text-sm 2xl:text-lg">How do you want to receive real-time appointment offers?</label>
                                    <div className="flex flex-col gap-4 mb-3">
                                        <label className="flex items-center border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4  text-sm 2xl:text-lg">
                                            <input type="radio" name="appointment-offers" value="email" className="mr-2" />
                                            Receive offers via Email
                                        </label>
                                        <label className="flex items-center border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4  text-sm 2xl:text-lg">
                                            <input type="radio" name="appointment-offers" value="whatsapp" className="mr-2" />
                                            Receive offers via WhatsApp (recommended)
                                        </label>
                                    </div>
                                    <small className="block">
                                        Choose your preferred way of receiving appointment offers and updates on your visit
                                    </small>
                                </div>
                                <div className="mb-8">
                                    <div className="mb-3">
                                        <label htmlFor="" className="block mb-3 font-semibold text-sm 2xl:text-lg">Email address:</label>
                                        <div>
                                            <input type="text" name="email" value="" placeholder="e.g. john@example.com" className="block w-full border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 hover:bg-primary/[.1] outline-0 text-sm 2xl:text-lg" />
                                        </div>
                                    </div>
                                    <small className="block">
                                        Your doctor will send prescription and invoice here Please enter a valid email address
                                    </small>
                                </div>
                                <div className="mb-8">
                                    <div className="mb-3">
                                        <label htmlFor="" className="block mb-3 font-semibold text-sm 2xl:text-lg">How do you wish to proceed?</label>
                                        <p className="mb-3">By creating an account, you can manage your appointments and requests with your personal account, and it eliminates the need to re-enter your details in future requests.</p>
                                        <p>Already have an account? <Link href="/" className="underline">Log in</Link></p>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="my-4">
                            <div className="flex lg:justify-between gap-4">
                                <Button text="Back" href="/appointment" style="primary" />
                                <Button text="Continue" href="/appointment" style="primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

