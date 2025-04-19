import HeroPrices from "../components/HeroPrices";
import PriceList from "./../components/PriceList";

import CTA from "./../components/CTA";
import FAQOnlineDoctor from "./../components/FAQOnlineDoctor";

import MainLayout from "./../layouts/MainLayout";

export default function Home() {
  return (
      <MainLayout>
          <HeroPrices />
          <PriceList />
          <FAQOnlineDoctor />
          <CTA />
      </MainLayout>
  );
}

