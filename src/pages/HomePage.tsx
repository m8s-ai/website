import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { OutcomesSection } from "@/components/sections/OutcomesSection";
import { IndustriesSection } from "@/components/sections/IndustriesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { CTASection } from "@/components/sections/CTASection";
import { PublicHeader } from "@/components/PublicHeader";

export const HomePage = () => {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main>
        <HeroSection />
        <ServicesSection />
        <OutcomesSection />
        <IndustriesSection />
        <ProcessSection />
        <TrustSection />
        <CTASection />
      </main>
    </div>
  );
};