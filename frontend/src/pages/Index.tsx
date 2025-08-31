
import { StatsCarousel } from "@/components/StatsCarousel";
import { ModernScenarios } from "@/components/ModernScenarios";
import { Header } from "@/components/Header";
import { AdvancedVillageListings } from "@/components/AdvancedVillageListings";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Index = () => {
  useScrollReveal();
  return (
    <div className="min-h-screen bg-background">
      {/* Header avec navigation */}
      <Header />
      
      {/* Stats carousel */}
      <header className="py-8">
        <StatsCarousel />
      </header>

      {/* Section principale */}
      <main className="space-y-16 pb-16">
  {/* Section avis clients retirée */}

        {/* Annonces de villages - NOUVEAU composant */}
        <section className="scroll-reveal">
          <AdvancedVillageListings />
        </section>

        {/* Scenarios modernes - Modes de livraison avec étapes intégrées */}
        <section className="scroll-reveal">
          <ModernScenarios />
        </section>
      </main>

      {/* Effects de particules en arrière-plan */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-purple-500/3 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default Index;
