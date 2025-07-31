
import { StatsCarousel } from "@/components/StatsCarousel";
import { CertifiedReviews } from "@/components/CertifiedReviews";
import { ModernTrustScore } from "@/components/ModernTrustScore";
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

      {/* TrustScore en haut de page - NOUVELLE POSITION */}
      <section className="py-8 px-4">
        <ModernTrustScore />
      </section>

      {/* Section principale avec espacement optimisé */}
      <main className="space-y-12 pb-12">
        {/* Section avis clients et confiance - MIEUX STRUCTURÉE */}
        <section className="scroll-reveal px-4">
          <div className="max-w-7xl mx-auto">
            {/* En-tête de section unifié */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gradient mb-4">
                Confiance & Avis Clients
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Découvrez pourquoi des milliers de clients nous font confiance pour leurs achats gaming
              </p>
            </div>

            {/* Container principal avec trust score intégré */}
            <div className="grid lg:grid-cols-4 gap-8 items-start">
              
              {/* Trust Score à gauche - POSITION FIXE */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <ModernTrustScore />
                  
                  {/* Statistiques de confiance supplémentaires */}
                  <div className="mt-6 space-y-3">
                    <div className="glass-effect rounded-xl p-4 text-center border border-blue-400/20">
                      <div className="text-2xl font-bold text-blue-400">100%</div>
                      <div className="text-xs text-muted-foreground">Achats sécurisés</div>
                    </div>
                    <div className="glass-effect rounded-xl p-4 text-center border border-green-400/20">
                      <div className="text-2xl font-bold text-green-400">24/7</div>
                      <div className="text-xs text-muted-foreground">Support client</div>
                    </div>
                    <div className="glass-effect rounded-xl p-4 text-center border border-purple-400/20">
                      <div className="text-2xl font-bold text-purple-400">&lt;5min</div>
                      <div className="text-xs text-muted-foreground">Livraison moyenne</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Avis clients à droite - CAROUSEL ÉLARGI */}
              <div className="lg:col-span-3">
                <CertifiedReviews />
              </div>

            </div>
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
