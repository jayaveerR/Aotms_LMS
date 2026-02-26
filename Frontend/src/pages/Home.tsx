import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import WhyAOTMS from "@/components/landing/WhyAOTMS";
import HowItWorks from "@/components/landing/HowItWorks";
import KeyFeatures from "@/components/landing/KeyFeatures";
import TechnologyEcosystem from "@/components/landing/TechnologyEcosystem";
import Instructors from "@/components/landing/Instructors";
import Testimonials from "@/components/landing/Testimonials";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import ScrollToTop from "@/components/landing/ScrollToTop";
import ChatbotWidget from "@/components/landing/ChatbotWidget";
import ScrollSpy from "@/components/landing/ScrollSpy";
import AmbientBackground from "@/components/ui/AmbientBackground";

const Home = () => {
  return (
    <div className="min-h-screen bg-black">
      <div id="home-content" className="bg-background relative z-10">
        <AmbientBackground />

        <Header />
        <main>
          <div id="main-content">
            <HeroSection />
          </div>
          <WhyAOTMS />
          <HowItWorks />
          <KeyFeatures />
          <TechnologyEcosystem />
          <Instructors />
          <Testimonials />
          <FAQSection />
          <CTASection />
        </main>
        <Footer />
        <ScrollToTop />
        <ScrollSpy />
        <ChatbotWidget />
      </div>
    </div>
  );
};

export default Home;
