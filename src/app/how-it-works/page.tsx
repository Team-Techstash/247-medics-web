import HeroHowItWorks from "../components/HeroHowItWorks";
import CardHorizontal from "./../components/CardHorizontal";
import Locations from "./../components/Locations";

import CTA from "./../components/CTA";
import FAQ2 from "./../components/FAQ2";

import MainLayout from "./../layouts/MainLayout";

export default function Home() {
  return (
      <MainLayout>
          <HeroHowItWorks />
          <CardHorizontal />
          <FAQ2 />
          <Locations />
          <CTA />
      </MainLayout>
  );
}

