import { StatsCarousel } from "@/components/StatsCarousel";
import { CertifiedReviews } from "@/components/CertifiedReviews";
import { ModernTrustScore } from "@/components/ModernTrustScore";
import { ModernScenarios } from "@/components/ModernScenarios";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header avec le carousel des stats */}
      <header className="py-8">
        <StatsCarousel />
      </header>

      {/* Section principale */}
      <main className="space-y-16 pb-16">
        {/* Avis clients certifiés */}
        <section className="scroll-reveal">
          <CertifiedReviews />
        </section>

        {/* Trust Score juste en dessous */}
        <section className="scroll-reveal flex justify-center">
          <ModernTrustScore />
        </section>

        {/* Scenarios modernes */}
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
