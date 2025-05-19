'use client'
import { useState } from "react";
import HeroWhatWeTreat from "../components/HeroWhatWeTreat";
import Registration from "../components/Registration";
import HowDoesItWork from "../components/HowDoesItWork";

import CTA3 from "../components/CTA3";
import CTA from "../components/CTA";
import FAQWhatWeTreat from "../components/FAQWhatWeTreat";

import MainLayout from "../layouts/MainLayout";
import { appointmentsService } from "@/api/services/service";
import { showToast } from '../../utils/toast';
import { useRouter } from "next/navigation";

export default function RegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const handleFormUpdate = (data: any) => {
    setFormData(data);
  };

  const handleSubmit = async (data: any) => {
          setFormData(data);
          setIsLoading(true);
          console.log(data)
  
          try {
              const response = await appointmentsService.create(data);
              if (response && response.success) {
                  showToast.success("Appointment created successfully!");
                  console.log(response)
                  router.push("/find");
              } else {
                 showToast.error(response.message || "Failed to create appointment.");
              }
          } catch (err: any) {
             showToast.error(err.message || "Failed to create appointment.");
          } finally {
              setIsLoading(false);
          }
      };

  return (
      <MainLayout>
          <Registration onSubmit={handleSubmit} />
      </MainLayout>
  );
}

