import Hero from "./components/Hero";
import BulletCountries from "./components/BulletCountries";
import HowItWorks from "./components/HowItWorks";
import BulletSection from "./components/BulletSection";
import CTA2 from "./components/CTA2";
import CTA from "./components/CTA";
import FAQ from "./components/FAQ";
import Testimonial from "./components/Testimonial";

import MainLayout from "./layouts/MainLayout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  return (
      <MainLayout>
        <ToastContainer position="top-right" autoClose={3000} />
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

