"use client";
import { useEffect, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { doctorService } from "@/api/services/service";
import Link from "next/link";
import Image from "next/image";

export default function DoctorOnBoarding() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status"); // 'success' or 'retry'
  const jwtToken = searchParams.get("jwtToken");
  const [opsError, setOpsError] = useState(false);

  useEffect(() => {
    if (status === "retry") {
      // Verify onboarding completion
      getStripeSetupLink();
    }
  }, [status]);

  const getStripeSetupLink = async () => {
    const res = await doctorService.getStripeSetupLink(jwtToken);
    const { onboardingUrl } = await res;
    if (onboardingUrl) {
      redirect(onboardingUrl); // Success!
    } else {
      setOpsError(true);
    }
  };

  return (
    <section className="relative min-h-screen h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Logo at top left */}
      <Link href="/" className="absolute top-6 left-6 z-20">
        <Image
          src="/images/logo-white.svg"
          alt="24/7 Medics Logo"
          width={180}
          height={60}
          className="w-auto h-12 md:h-16"
          priority
        />
      </Link>
      {/* Background Image */}
      <Image
        src="/bg.jpg"
        alt="Background"
        fill
        className="fixed lg:absolute top-0 left-0 w-full h-full object-cover object-center z-0"
        priority
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/[.5] z-0"></div>
      <div className="container mx-auto relative h-full z-10 flex items-center justify-center min-h-screen">
        <div className="grid lg:grid-cols-2 gap-30 items-center h-full w-full max-w-6xl mx-auto px-4 md:px-8 justify-items-center">
          {/* Left Side */}
          <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-start h-full">
            <h2 className="text-4xl md:text-6xl 2xl:text-7xl font-medium text-white mb-10 capitalize">
              24/7 Medics <br />Care anywhere, <br />anytime!
            </h2>
            
          </div>
          {/* Right Side (Onboarding Message) */}
          <div className="bg-white/70 rounded-4xl px-6 py-6 2xl:px-10 min-h-[30px] max-w-md w-full overflow-hidden flex flex-col justify-center items-center shadow-xl">
            {status === "success" ? (
              <div className="text-center flex flex-col items-center">
                <div className="text-2xl md:text-3xl font-bold text-primary whitespace-nowrap mb-6">
                  Payouts Setup Completed
                  <span className="blink text-primary">!</span>
                </div>
                <span className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>
            ) : null}
            {opsError === true ? (
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-red-600 mb-6">
                  Something Went Wrong Please contact Support!
                </div>
                <Link href="/" className="inline-block px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors duration-200 font-semibold mt-4">
                  Return Home
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <style jsx>{`
        .blink {
          animation: blink-animation 1s steps(2, start) infinite;
        }
        @keyframes blink-animation {
          to {
            visibility: hidden;
          }
        }
      `}</style>
    </section>
  );
}
