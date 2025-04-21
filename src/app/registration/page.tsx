'use client'
import { useState } from "react";
import HeroWhatWeTreat from "../components/HeroWhatWeTreat";
import Registration from "./../components/Registration";
import HowDoesItWork from "./../components/HowDoesItWork";

import CTA3 from "./../components/CTA3";
import CTA from "./../components/CTA";
import FAQWhatWeTreat from "./../components/FAQWhatWeTreat";

import MainLayout from "./../layouts/MainLayout";

export default function RegistrationPage() {
  const [formData, setFormData] = useState({});
  const handleFormUpdate = (data: any) => {
    setFormData(data);
  };

  return (
      <MainLayout>
          <Registration onFormUpdate={handleFormUpdate} />
      </MainLayout>
  );
}

