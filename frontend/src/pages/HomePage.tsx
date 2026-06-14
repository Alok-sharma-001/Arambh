import HeroSection from '@/sections/HeroSection';
import FeaturesSection from '@/sections/FeaturesSection';
import InteractiveDemoSection from '@/sections/InteractiveDemoSection';
import MapCTASection from '@/sections/MapCTASection';

export default function HomePage() {
  return (
    <main className="bg-near-black">
      <HeroSection />
      <FeaturesSection />
      <InteractiveDemoSection />
      <MapCTASection />
    </main>
  );
}
