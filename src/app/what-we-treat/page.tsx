import HeroWhatWeTreat from "../components/HeroWhatWeTreat";
import CardWithCheckbox from "./../components/CardWithCheckbox";
import HowDoesItWork from "./../components/HowDoesItWork";

import CTA3 from "./../components/CTA3";
import CTA from "./../components/CTA";
import FAQWhatWeTreat from "./../components/FAQWhatWeTreat";

import MainLayout from "./../layouts/MainLayout";

export default function Home() {
  return (
      <MainLayout>
          <HeroWhatWeTreat />
          <CardWithCheckbox />
          <CTA3 />
          <HowDoesItWork />
          <FAQWhatWeTreat />
          <CTA />
      </MainLayout>
  );
}

