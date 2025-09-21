
import { StatsCarousel } from "@/components/StatsCarousel";
import { CertifiedReviews } from "@/components/CertifiedReviews";
// import { RealisticTrustScore } from "@/components/RealisticTrustScore";
import { ModernScenarios } from "@/components/ModernScenarios";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdvancedVillageListings } from "@/components/AdvancedVillageListings";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Index = () => {
  useScrollReveal();
  return (
    <div className="min-h-screen bg-background">
      {/* Header avec navigation amélioré */}
      <Header />

  {/* TrustScore supprimé */}

      {/* Section principale avec espacement optimisé */}
      <main className="space-y-12 pb-12">
        {/* Section avis clients - SANS en-tête */}
        <section className="scroll-reveal px-4">
          <div className="max-w-7xl mx-auto">
            {/* Avis clients directement sans en-tête */}
            <CertifiedReviews />
          </div>
        </section>

        {/* Séparateur visuel discret */}
        <div className="w-full border-t border-white/5"></div>

        {/* Annonces de villages - section principale mieux structurée */}
        <section className="scroll-reveal">
          <AdvancedVillageListings />
        </section>

        {/* Séparateur visuel discret */}
        <div className="w-full border-t border-white/5"></div>

        {/* Scenarios modernes - Modes de livraison avec espacement harmonisé */}
        <section className="scroll-reveal px-4">
          <div className="max-w-7xl mx-auto">
            <ModernScenarios />
          </div>
        </section>
      </main>

      {/* Footer amélioré */}
      <Footer />

      {/* Effects de particules en arrière-plan - rendus plus subtils */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-primary/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-20 h-20 bg-cyan-500/3 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-purple-500/2 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default Index;
