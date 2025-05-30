"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "./Button";
import Button3 from "./Button3";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setAppointmentForm } from "@/redux/slices/appointmentFormSlice";
import AutoCompleteComponent from "@/utils/google";
import { referenceService } from "@/api/services/service";

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
      "Gout",
    ],
  },
  {
    title: "Skin Problems",
    text: "Our doctors provide treatment for rashes, acne, and infections, helping you resolve skin issues while you're away from home.",
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
      "Mouth Sores",
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
      "Enlarged / Inflamed Tonsils",
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
      "Sports Injury",
    ],
  },
  {
    title: "Women's & Men's Health",
    text: "Women's and men's health issues can arise unexpectedly while traveling. We provide quick treatment for common concerns. Stay well and enjoy your trip with peace of mind.",
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
      "Erectile Dysfunction (ED)",
    ],
  },
  {
    title: "Children's Health",
    text: "Get prompt care for children's health issues while traveling, ensuring your little ones stay healthy and enjoy the journey.",
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
      "Constipation",
    ],
  },
  {
    title: "Prescription Renewals",
    text: "Doctors can handle prescription renewals for travelers who run out of medications, forget to pack them, or lose them while away. Not suitable for controlled substances.",
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
      "Treatment for ED",
    ],
  },
];

interface FormData {
  age: number;
  isForSelf: boolean;
  country: string;
  city: string;
  serviceType: string;
  firstName: string;
  lastName: string;
  gender: string;
  pronouns: string;
  email: string;
  visitType: string;
  appointmentMode: string;
  reason: string;
  formattedAddress: string;
}

type CreateAppointmentProps = {
  onSubmit: (formData: any) => void;
};
type Service = {
  id: number;
  code: string;
  name: string;
};

type ServicesMap = {
  [key: string]: Service;
};


export default function CreateAppointment({
  onSubmit,
}: CreateAppointmentProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;

  const [authToken, setAuthToken] = useState<string | null>(null);
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.appointmentForm);
  const [services, setServices] = useState<ServicesMap>({});
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(setAppointmentForm({ [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      setAuthToken(token);
    }
    loadReferences()
  }, []);

  const determineInitialStep = () => {
    if (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.age &&
      formData.gender
    ) {
      return 3;
    } else if (formData.city && formData.country && formData.serviceType) {
      return 3;
    } else if (formData.reason) {
      return 2;
    } else {
      return 1;
    }
  };
  const [currentStep, setCurrentStep] = useState(determineInitialStep());

  const nextStep = () => {
    const stepErrors = validateStep();
    if (Object.keys(stepErrors).length !== 0) {
      return;
    }
    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const stepErrors = validateStep();
    if (Object.keys(stepErrors).length !== 0) {
      return;
    }
    onSubmit(formData);
  };

  const validateStep = () => {
    let stepErrors: Partial<Record<keyof FormData, string>> = {};
    console.log("called");
    if (currentStep === 1) {
      console.log("Step 1 validation");
      // if (formData.isForSelf == null) stepErrors.isForSelf = "Please select who requires attention.";

      if (!formData.reason) stepErrors.reason = "Please describe the issue.";
    }

    if (currentStep === 2) {
      if (!formData.city) stepErrors.city = "City is required.";
      if (!formData.country) stepErrors.country = "Country is required.";
      if (!formData.serviceType)
        stepErrors.serviceType = "Service Type is required.";
    }

    if (currentStep === 3) {
      if (!formData.firstName) stepErrors.firstName = "First name is required.";
      if (!formData.lastName) stepErrors.lastName = "Last name is required.";
      if (!formData.email) {
        stepErrors.email = "Email is required.";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        stepErrors.email = "Please enter a valid email address.";
      }
      if (
        formData.age === undefined ||
        formData.age === null ||
        formData.age === 0
      ) {
        stepErrors.age = "Age is required.";
      }
      if (!formData.gender) stepErrors.gender = "Please select your sex.";
    }

    setErrors({ ...stepErrors });
    console.log(formData, stepErrors);

    return stepErrors;
  };

  const handleLocationSelect = (location: { lat: number; lng: number; city: string; country: string; formattedAddress: string }) => {
    dispatch(setAppointmentForm({
      city: location.city,
      country: location.country,
      formattedAddress: location.formattedAddress
    }));
  };

  const loadReferences = async () => {
    try {
      const response = await referenceService.getReferences();
      if (response && response.data) {
        setServices(response.data.SERVICE_TYPES)
      } else {
        console.error(response.message || "Failed to create appointment.");
      }
    } catch (err: any) {
      console.error(err.message || "Failed to create appointment.");
    }
  };

  return (
    <section className="relative py-10 px-6 2xl:py-18 -mt-18 lg:h-screen flex items-center">
      <Image
        src="/bg.jpg"
        alt=""
        width={100}
        height={100}
        className="fixed lg:absolute top-0 left-0 w-full h-full object-cover object-center"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/[.5]"></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="container mx-auto relative h-full"
      >
        <Link href="/" className="flex justify-center">
          <Image
            src="/images/logo-white.svg"
            alt=""
            width={250}
            height={100}
            className="absolute top-0 left-0 w-50 2xl:w-70"
          />
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
          <div className="lg:mt-20 pt-30 md:py-30 text-center lg:text-start">
            <h2 className="text-4xl md:text-6xl 2xl:text-7xl font-medium text-white mb-10 capitalize">
              24/7 Medics <br />
              Care anywhere, <br />
              anytime!
            </h2>
            <Button3 text="Continue" href="/appointment" style="primary" />
          </div>
          <div className="bg-white rounded rounded-4xl px-6 py-7 2xl:px-10 2xl:py-10 h-full overflow-hidden scroll-m-10 flex flex-col justify-between">
            <div className="overflow-auto">
              <h2 className="text-2xl md:text-3xl 2xl:text-5xl font-medium mb-4 2xl:mb-6">
                Join us today!
              </h2>
              <p className="mt-3 text-primary mb-10">Enter the detail below</p>

              <form
                onSubmit={handleSubmit}
              >
                {currentStep === 1 && (
                  <div className="">
                    {" "}
                    {/*Step 1*/}
                    {/* <div className="mb-8">
                                            <label htmlFor="" className="block mb-3 font-semibold text-sm 2xl:text-lg">Who requires medical attention?</label>
                                            <div className="grid lg:grid-cols-2 gap-4">
                                                <label className="flex items-center border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4  text-sm 2xl:text-lg">
                                                    <input type="radio" checked={formData.isForSelf === true}
                                                        onChange={() => setFormData({ ...formData, isForSelf: true })} name="isForSelf" value="me" className="mr-2" />
                                                    Me
                                                </label>
                                                <label className="flex items-center border rounded-lg 2xl:rounded-2xl rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 text-sm 2xl:text-lg">
                                                    <input type="radio" checked={formData.isForSelf === false}
                                                        onChange={() => setFormData({ ...formData, isForSelf: false })} name="attention" value="someone-else" className="mr-2" />
                                                    Someone else
                                                </label>
                                            </div>
                                            {errors.isForSelf && (
                                                <p className="text-red-500 !text-sm mt-2">{errors.isForSelf}</p>
                                            )}
                                        </div> */}
                    <div className="mb-8">
                      <div className="mb-3">
                        <label
                          htmlFor=""
                          className="block mb-3 font-semibold text-sm 2xl:text-lg"
                        >
                          How can the doctor help you?
                        </label>
                        <textarea
                          name="reason"
                          value={formData.reason}
                          onChange={handleChange}
                          className="block w-full border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 hover:bg-primary/[.1] outline-0 text-sm 2xl:text-lg"
                          rows={4}
                        ></textarea>
                        {errors.reason && (
                          <p className="text-red-500 !text-sm mt-2">
                            {errors.reason}
                          </p>
                        )}
                      </div>
                      {/* <small className="block">
                        Specify symptoms or medication needed so doctors can
                        assist. Your request is fully anonymized; doctors see
                        only the description. Avoid personal details.
                      </small> */}
                    </div>
                    {!authToken && (
                      <div className="mb-8">
                        <div className="mt-3">
                          <p>
                            Already have an account?{" "}
                            <Link
                              href={`/login?from=/create-appointment&step=${currentStep}`}
                              className="underline"
                            >
                              Log in
                            </Link>
                          </p>
                        </div>
                      </div>
                    )}
                    {/* <div className="mb-8">
                                            <label htmlFor="" className="block mb-3 font-semibold text-sm 2xl:text-lg">What brings you in?</label>
                                            <div className="flex flex-col gap-4">
                                                <div onClick={() => setSelected('urgent')} className={`border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 font-semibold flex justify-between items-center  ${selected === 'urgent' ? 'bg-primary/[.1] border' : 'bg-white'
                                                    }`}>
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
                                                </div>
                                                <div onClick={() => setSelected('appointment')} className={`border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 font-semibold flex justify-between items-center  ${selected === 'appointment' ? 'bg-primary/[.1] border' : 'bg-white'
                                                    }`}>
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
                                                </div>
                                            </div>
                                            {!authToken && <div className="mb-8">
                                                <div className="mt-3">
                                                    <p>Already have an account? <Link href="/login?from=/create-appointment" className="underline">Log in</Link></p>
                                                </div>
                                            </div>
                                            }

                                        </div> */}
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="">
                    {" "}
                    {/*Step 3*/}
                    <div className="mb-8">
                      <div className="mb-3">
                        <label
                          htmlFor="city"
                          className="block mb-3 font-semibold text-sm 2xl:text-lg"
                        >
                          What city are you in?
                        </label>
                        <AutoCompleteComponent
                          setLocation={(location) => {
                            handleLocationSelect(location);
                          }}
                          currentCity={formData.city}
                          currentFormattedAddress={formData.formattedAddress}
                        />
                        {errors.city && (
                          <p className="text-red-500 !text-sm mt-2">
                            {errors.city}
                          </p>
                        )}
                      </div>
                      <small className="block">
                        Make sure the city you pick is where you need assistance
                      </small>
                    </div>
                    <div className="mb-8">
                      <div className="mb-3">
                        <label className="block mb-3 font-semibold text-sm 2xl:text-lg">
                          Which type of healthcare service do you need?
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {Object.entries(services).map(([key, type]) => (
                            <label
                              key={key}
                              className={`cursor-pointer rounded-full px-5 py-2 text-sm 2xl:text-lg transition-all ${formData.serviceType === type.code
                                  ? "bg-[#9904A160] text-black"
                                  : "bg-gray-200 text-black"
                                }`}
                            >
                              <input
                                type="radio"
                                name="serviceType"
                                value={type.code}
                                checked={formData.serviceType === type.code}
                                onChange={handleChange}
                                className="hidden"
                              />
                              {type.name}
                            </label>
                          ))}

                        </div>
                        {errors.serviceType && (
                          <p className="text-red-500 !text-sm mt-2">
                            {errors.serviceType}
                          </p>
                        )}
                      </div>
                    </div>
                    {!authToken && (
                      <div className="mb-8">
                        <div className="mt-3">
                          <p>
                            Already have an account?{" "}
                            <Link
                              href={`/login?from=/create-appointment&step=${currentStep}`}
                              className="underline"
                            >
                              Log in
                            </Link>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="">
                    {" "}
                    {/*Step 4*/}
                    <div className="mb-8">
                      <div className="mb-3">
                        <label
                          htmlFor=""
                          className="block mb-3 font-semibold text-sm 2xl:text-lg"
                        >
                          Your name
                        </label>
                        <div className="grid lg:grid-cols-2 gap-4">
                          <div>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              placeholder="First Name"
                              className="block w-full border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 hover:bg-primary/[.1] outline-0 text-sm 2xl:text-lg"
                            />
                            {errors.firstName && (
                              <p className="text-red-500 !text-sm mt-2">
                                {errors.firstName}
                              </p>
                            )}
                          </div>
                          <div>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              placeholder="Last Name"
                              className="block w-full border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 hover:bg-primary/[.1] outline-0 text-sm 2xl:text-lg"
                            />
                            {errors.lastName && (
                              <p className="text-red-500 !text-sm mt-2">
                                {errors.lastName}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <small className="block">
                        Use your real name to ensure proper care. Your details
                        are shared only with the doctor you choose to book with.
                      </small>
                    </div>
                    <div className="mb-8">
                      <div className="mb-3">
                        <label
                          htmlFor=""
                          className="block mb-3 font-semibold text-sm 2xl:text-lg"
                        >
                          Email address:
                        </label>
                        <div>
                          <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="e.g. john@example.com"
                            className="block w-full border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 hover:bg-primary/[.1] outline-0 text-sm 2xl:text-lg"
                          />
                          {errors.email && (
                            <p className="text-red-500 !text-sm mt-2">
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <small className="block">
                        Your doctor will send prescription and invoice here
                        Please enter a valid email address
                      </small>
                    </div>
                    <div className="mb-8">
                      <div>
                        <label
                          htmlFor=""
                          className="block mb-3 font-semibold text-sm 2xl:text-lg"
                        >
                          How old are you?
                        </label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={handleChange}
                          name="age"
                          className="block w-full border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 hover:bg-primary/[.1] outline-0 text-sm 2xl:text-lg"
                        />
                        {errors.age && (
                          <p className="text-red-500 !text-sm mt-2">
                            {errors.age}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mb-8">
                      <label
                        htmlFor=""
                        className="block mb-3 font-semibold text-sm 2xl:text-lg"
                      >
                        Sex
                      </label>
                      <div className="grid lg:grid-cols-2 gap-4">
                        <label className="flex items-center border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4  text-sm 2xl:text-lg">
                          <input
                            type="radio"
                            name="gender"
                            checked={formData.gender === "male"}
                            onChange={handleChange}
                            value="male"
                            className="mr-2"
                          />
                          Male
                        </label>
                        <label className="flex items-center border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4  text-sm 2xl:text-lg">
                          <input
                            type="radio"
                            name="gender"
                            checked={formData.gender === "female"}
                            onChange={handleChange}
                            value="female"
                            className="mr-2"
                          />
                          Female
                        </label>
                      </div>
                      {errors.gender && (
                        <p className="text-red-500 !text-sm mt-2">
                          {errors.gender}
                        </p>
                      )}
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor=""
                        className="block mb-3 font-semibold text-sm 2xl:text-lg"
                      >
                        Your Pronouns (optional)
                      </label>
                      <div>
                        <input
                          type="text"
                          name="pronouns"
                          value={formData.pronouns}
                          onChange={handleChange}
                          className="block w-full border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 hover:bg-primary/[.1] outline-0 text-sm 2xl:text-lg"
                        />
                      </div>
                    </div>
                    {!authToken && (
                      <div className="mb-8">
                        <div className="mt-3">
                          <p>
                            Already have an account?{" "}
                            <Link
                              href={`/login?from=/create-appointment&step=${currentStep}`}
                              className="underline"
                            >
                              Log in
                            </Link>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* {currentStep === 4 && (
                                    <div className=""> 
                                        <div className="mb-8">
                                            <label htmlFor="" className="block mb-3 font-semibold text-sm 2xl:text-lg">How do you want to receive real-time appointment offers?</label>
                                            <div className="flex flex-col gap-4 mb-3">
                                                <label className="flex items-center border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4  text-sm 2xl:text-lg">
                                                    <input type="radio" name="appointmentOffers" onChange={handleChange} checked={formData.appointmentOffers === "email"} value="email" className="mr-2" />
                                                    Receive offers via Email
                                                </label>
                                                <label className="flex items-center border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4  text-sm 2xl:text-lg">
                                                    <input type="radio" name="appointmentOffers" onChange={handleChange} checked={formData.appointmentOffers === "whatsapp"} value="whatsapp" className="mr-2" />
                                                    Receive offers via WhatsApp (recommended)
                                                </label>
                                            </div>
                                            <small className="block">
                                                Choose your preferred way of receiving appointment offers and updates on your visit
                                            </small>
                                        </div>

                                        {!authToken &&
                                            <div className="mb-8">
                                                <div className="mt-3">
                                                    <label htmlFor="" className="block mb-3 font-semibold text-sm 2xl:text-lg">How do you wish to proceed?</label>
                                                    <p className="mb-3">By creating an account, you can manage your appointments and requests with your personal account, and it eliminates the need to re-enter your details in future requests.</p>
                                                    <p>Already have an account? <Link href="/login?from=/create-appointment" className="underline">Log in</Link></p>

                                                </div>
                                            </div>
                                        }

                                    </div>
                                )} */}
              </form>
            </div>
            <div className="my-4">
              <div className="flex lg:justify-between gap-4">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="bg-primary text-white px-6 py-3 rounded-full inline-flex items-center hover:bg-secondary transition text-lg"
                  >
                    Back{" "}
                  </button>
                )}

                {currentStep < 3 && (
                  <button
                    onClick={nextStep}
                    className="bg-primary text-white px-6 py-3 rounded-full inline-flex items-center hover:bg-secondary transition text-lg ml-auto"
                  >
                    Next{" "}
                    <Image
                      src="/images/btn-arrow.svg"
                      alt="24/7 Medics"
                      width={12}
                      height={13}
                      className="ms-3"
                    />
                  </button>
                )}

                {currentStep === 3 && authToken && (
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-primary text-white px-6 py-3 rounded-full inline-flex items-center hover:bg-secondary transition text-lg"
                  >
                    Submit{" "}
                    <Image
                      src="/images/btn-arrow.svg"
                      alt="24/7 Medics"
                      width={12}
                      height={13}
                      className="ms-3"
                    />
                  </button>
                )}

                {currentStep === 3 && !authToken && (
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/signup?from=/create-appointment&step=${currentStep}`
                      )
                    }
                    className="bg-primary text-white px-6 py-3 rounded-full inline-flex items-center hover:bg-secondary transition text-lg"
                  >
                    Create Account{" "}
                    <Image
                      src="/images/btn-arrow.svg"
                      alt="24/7 Medics"
                      width={12}
                      height={13}
                      className="ms-3"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
