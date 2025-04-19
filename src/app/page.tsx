import Hero from "./components/Hero";
import BulletCountries from "./components/BulletCountries";
import HowItWorks from "./components/HowItWorks";
import BulletSection from "./components/BulletSection";
import CTA2 from "./components/CTA2";
import CTA from "./components/CTA";
import FAQ from "./components/FAQ";
import Testimonial from "./components/Testimonial";

import MainLayout from "./layouts/MainLayout";

export default function Home() {
  return (
      <MainLayout>
          <Hero />
          <CTA2 />
          <BulletCountries />
          <HowItWorks />
          <BulletSection />
          <Testimonial />
          <FAQ />
          <CTA />
      </MainLayout>
  );
}

