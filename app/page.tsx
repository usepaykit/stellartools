"use client";


import { HeroBackground } from "@/components/landing/hero-background";
import HeroSection from "@/components/landing/hero-section";
import { Header } from "@/components/ui/navbar";
import FeaturesSection from "@/components/landing/features-section";
import WidgetSection from "@/components/landing/widget";
import FooterSection from "@/components/landing/footer-section";
import { AppConnectionWidget } from "@/components/landing/app-connection-wdget";

export default function Home() {
  return (
    <HeroBackground>
      <div className="bg-background min-h-screen scroll-smooth">
        <Header />

        {/* Main Content */}
        <HeroSection />
        <WidgetSection />
        <AppConnectionWidget />
        <FeaturesSection />
        <FooterSection />
      </div>
    </HeroBackground>
  );
}
