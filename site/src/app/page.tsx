import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturesSection />
      <FinalCTA />
    </>
  );
}
