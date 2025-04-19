import HeroOnlineDoctor from "../components/HeroOnlineDoctor";
import CardWithCheckboxOnlineDoctor from "./../components/CardWithCheckboxOnlineDoctor";

import DoctorsInCountries from "./../components/DoctorsInCountries";
import CTA from "./../components/CTA";
import FAQOnlineDoctor from "./../components/FAQOnlineDoctor";

import MainLayout from "./../layouts/MainLayout";
import OnlineDoctorContent from "../components/OnlineDoctorContent";

export default function Home() {
  return (
      <MainLayout>
          <HeroOnlineDoctor />
          <OnlineDoctorContent />
          <CardWithCheckboxOnlineDoctor />
          <DoctorsInCountries />
          <FAQOnlineDoctor />
          <CTA />
      </MainLayout>
  );
}

