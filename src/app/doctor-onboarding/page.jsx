"use client";
import { useEffect, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { doctorService } from "@/api/services/service";

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
    <>
      {status === "success" ? (
        <>
          <section className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="text-center p-8 rounded-lg shadow-xl max-w-md mx-auto">
              <div className="text-2xl md:text-3xl font-bold ">
                Onboarding was successful!
              </div>
            </div>
          </section>
        </>
      ) : null}
      {opsError === true ? (
        <>
          {" "}
          <section className="relative py-10 px-6 2xl:py-18 -mt-18 lg:h-full flex items-center">
            Something Went Wrong Please contact Support!
          </section>
        </>
      ) : null}
    </>
  );
}
