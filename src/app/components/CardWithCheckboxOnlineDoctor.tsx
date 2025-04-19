"use client";

import Image from "next/image";

const sections = [
    {
        title: "General Illness",
        text: "With 24/7 Medics, you can tackle colds, allergies, and infections, keeping you healthy so you can enjoy your trip.",
        image: "/images/General-Illness.jpg",
        list: [
            "Urinary Tract Infections",
            "Vaginal Yeast Infections",
            "Strep Throat",
            "Bacterial Vaginosis",
            "Flu",
            "Sinus Infection",
            "Cold Sores",
            "Diarrhea",
            "Cellulitis / Skin Infection",
            "Gout",
            "Pink Eye (Conjunctivitis)",
            "Chlamydia Treatment",
            "See all conditions"
        ],
    },
    {
        title: "Prescription renewals",
        text: "Doctors can handle prescription renewals for travelers who run out of medications, forget to pack them, or lose them while away. Not suitable for controlled substances.",
        image: "/images/Prescription-renewals.jpg",
        list: [
            "Blood Pressure Medications",
            "Diabetes Medications",
            "Cholesterol Medications",
            "Thyroid Medications",
            "Asthma Inhalers",
            "Allergy Medications",
            "ED Medications",
            "Birth Control Pill",
            "EpiPens",
            "Malaria Prevention Pills"
        ],
    },
];


const BulletSection = () => {
    return (
        <section className="relative bg-light py-10 px-6 lg:py-20">
            <div className="container mx-auto">
                <h1 className="text-2xl md:text-4xl 2xl:text-4xl font-medium text-primary mb-10 xl:mb-18">Common Conditions Treated By Online Doctors</h1>
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
            </div>
        </section>
    );
};

export default BulletSection;
