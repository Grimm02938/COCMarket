
import { StatsCarousel } from "@/components/StatsCarousel";
import { CertifiedReviews } from "@/components/CertifiedReviews";
// import { RealisticTrustScore } from "@/components/RealisticTrustScore";
import { ModernScenarios } from "@/components/ModernScenarios";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdvancedVillageListings } from "@/components/AdvancedVillageListings";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Zap } from "lucide-react";

const Index = () => {
  useScrollReveal();

  const scrollToProducts = () => {
    const productsSection = document.querySelector('#villages-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec navigation amélioré */}
      <Header />

      {/* Hero Section - Greeting */}
      <section className="relative px-4 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Main Greeting */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Salut
              </span>
              <span className="text-white"> Gamers!</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto">
              Bienvenue sur <span className="text-primary font-semibold">CocMarket</span>, 
              la marketplace gaming de nouvelle génération
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Achetez et vendez vos comptes gaming en toute sécurité avec notre système de livraison instantané
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={scrollToProducts}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              Commencer à acheter
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={scrollToProducts}
              className="border-gray-600 text-white hover:bg-gray-800/50 px-8 py-4 rounded-xl backdrop-blur-sm transition-all duration-300"
            >
              Vendre vos comptes
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 p-4 rounded-xl bg-background/30 backdrop-blur-sm border border-white/10">
              <Shield className="w-6 h-6 text-green-400" />
              <div className="text-left">
                <div className="text-white font-semibold">100% Sécurisé</div>
                <div className="text-gray-400 text-sm">Transactions protégées</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 p-4 rounded-xl bg-background/30 backdrop-blur-sm border border-white/10">
              <Zap className="w-6 h-6 text-yellow-400" />
              <div className="text-left">
                <div className="text-white font-semibold">Livraison Instantané</div>
                <div className="text-gray-400 text-sm">En moins de 5 minutes</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 p-4 rounded-xl bg-background/30 backdrop-blur-sm border border-white/10">
              <Star className="w-6 h-6 text-purple-400" />
              <div className="text-left">
                <div className="text-white font-semibold">Comptes Vérifiés</div>
                <div className="text-gray-400 text-sm">Qualité garantie</div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>
      </section>

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
        <section className="scroll-reveal" id="villages-section">
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
