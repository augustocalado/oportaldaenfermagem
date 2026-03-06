import { Header } from "@/components/portal/Header";
import { LGPDNotice } from "@/components/portal/LGPDNotice";
import { HeroSlider } from "@/components/portal/HeroSlider";
import { CoursesSection } from "@/components/portal/CoursesSection";
import { NewsSection } from "@/components/portal/NewsSection";
import { MaterialsSection } from "@/components/portal/MaterialsSection";
import { TestimonialsSection } from "@/components/portal/TestimonialsSection";
import { PartnersSection } from "@/components/portal/PartnersSection";
import { NewsletterSection } from "@/components/portal/NewsletterSection";
import { Footer } from "@/components/portal/Footer";
import { SEO } from "@/components/portal/SEO";

const Index = () => {
  console.log("Index: rendering");
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Início"
        description="O maior portal de educação continuada e informações para profissionais de enfermagem no Brasil."
      />
      <Header />
      <HeroSlider />
      <CoursesSection />
      <NewsSection />
      <MaterialsSection />
      <TestimonialsSection />
      <PartnersSection />
      <NewsletterSection />
      <Footer />
      <LGPDNotice />
    </div>
  );
};

export default Index;
