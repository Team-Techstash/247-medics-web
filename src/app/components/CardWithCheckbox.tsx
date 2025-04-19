"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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

const BulletSection = () => {
    return (
        <section className="relative py-10 px-6 lg:py-20">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="container mx-auto">
                <div className="grid lg:grid-cols-2 gap-12">
                    {sections.map((section, index) => (
                        <div key={index}>
                            <h2 className="text-2xl md:text-4xl 2xl:text-4xl font-medium text-primary mb-6">{section.title}</h2>
                            <Image
                                src={section.image}
                                alt={section.title}
                                width={500}
                                height={285}
                                className="rounded-xl w-full mb-6"
                            />
                            <p className="mt-3 text-primary mb-5">{section.text}</p>
                            {section.list.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-primary xl:text-xl my-3">
                                    <span className="bg-secondary w-7 h-7 rounded-full flex items-center justify-center">
                                        <Image
                                            src="/images/btn-arrow.svg"
                                            alt="Bullet"
                                            width={10}
                                            height={10}
                                        />
                                    </span>
                                    <p>{item}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default BulletSection;
