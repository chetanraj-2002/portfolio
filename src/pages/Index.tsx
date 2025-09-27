import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import DatabaseAboutSection from '@/components/DatabaseAboutSection';
import StatsSection from '@/components/StatsSection';
import DatabaseProjectsSection from '@/components/DatabaseProjectsSection';
import DatabaseTimelineSection from '@/components/DatabaseTimelineSection';
import DatabaseTestimonialsSection from '@/components/DatabaseTestimonialsSection';
import DatabaseMediaSection from '@/components/DatabaseMediaSection';
import DatabaseCertificatesSection from '@/components/DatabaseCertificatesSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <DatabaseAboutSection />
      <StatsSection />
      <DatabaseProjectsSection />
      <DatabaseCertificatesSection />
      <DatabaseTimelineSection />
      <DatabaseTestimonialsSection />
      <DatabaseMediaSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
