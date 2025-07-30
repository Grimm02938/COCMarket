import { useState } from "react";
import { ArrowLeft, Star, Shield, ShieldX, Clock, ChevronLeft, ChevronRight, Play, Eye, Info, CheckCircle, Crown, Swords, Home, Zap, Users, Trophy, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VillageDetailsProps {
  villageId?: number;
  onBack?: () => void;
}

export const VillageDetails = ({ villageId = 1, onBack }: VillageDetailsProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  // Données simulées d'un village
  const village = {
    id: villageId,
    title: "Village Premium HDV 17 Maxé",
    price: "89.99",
    originalPrice: "120.00",
    rating: 4.9,
    reviews: 127,
    level: "HDV 17 - Maxé",
    seller: "ProGamer_FR",
    verified: true,
    protected: true,
    delivery: "Instantané",
    server: "France",
    images: [
      { id: 1, name: "Vue générale", type: "overview" },
      { id: 2, name: "Défenses", type: "defense" },
      { id: 3, name: "Ressources", type: "resources" },
      { id: 4, name: "Héros", type: "heroes" },
      { id: 5, name: "Armée", type: "army" },
      { id: 6, name: "Statistiques", type: "stats" }
    ],
    characteristics: {
      "Town Hall Level": { value: "17", icon: Home },
      "Archer Queen Level": { value: "100", icon: Crown },
      "Barbarian King Level": { value: "100", icon: Crown },
      "Grand Warden Level": { value: "75", icon: Crown },
      "Royal Champion Level": { value: "50", icon: Crown },
      "Minion Prince Level": { value: "90", icon: Crown },
      "Hero Hall Level": { value: "11", icon: Home },
      "Battle Copter Level": { value: "35", icon: Target },
      "Platform": { value: "Supercell ID", icon: Shield },
      "Experience Level": { value: "253", icon: Trophy }
    },
    sellerDescription: `
✅ Instant Delivery Direct to Your Email After Purchase
✅ Connect to your own mail, only you have access  
✅ Complete Ownership - Yours to Keep, Forever
✅ 100% Secure - Latest Updates & Maximum Protection
✅ OVER A THOUSAND OF COC ACCOUNTS HAS BEEN SUCCESSFULLY RELEASED

Message me for discount TG/RV group -> t.me/moderatormarkets
    `,
    igvVerified: true,
    verificationDate: "Jul 29th, 2025 08:48:40"
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % village.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + village.images.length) % village.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec retour */}
      <div className="sticky top-0 z-50 glass-effect border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-primary hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux annonces
          </Button>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Village ID: #{village.id}</p>
            <p className="text-lg font-bold text-primary">€{village.price}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section images - Interface révolutionnaire */}
          <div className="space-y-6">
            {/* Galerie principale avec effet 3D */}
            <div className="relative glass-effect rounded-2xl overflow-hidden card-3d group">
              <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary/30 to-cyan-500/30 rounded-3xl flex items-center justify-center mb-4 floating">
                      <Shield className="w-16 h-16 text-primary" />
                    </div>
                    <p className="text-lg font-bold text-primary">{village.images[currentImageIndex].name}</p>
                    <p className="text-sm text-muted-foreground">{village.level}</p>
                  </div>
                </div>

                {/* Contrôles de navigation 3D */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-background/80 hover:bg-background rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                >
                  <ChevronLeft className="w-6 h-6 text-primary" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-background/80 hover:bg-background rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                >
                  <ChevronRight className="w-6 h-6 text-primary" />
                </button>

                {/* Indicateur d'image */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {village.images.length}
                </div>

                {/* Badge protection */}
                <div className="absolute top-4 right-4">
                  {village.protected ? (
                    <div className="bg-green-500/20 p-3 rounded-full border-2 border-green-400/50">
                      <Shield className="w-6 h-6 text-green-400" />
                    </div>
                  ) : (
                    <div className="bg-red-500/20 p-3 rounded-full border-2 border-red-400/50">
                      <ShieldX className="w-6 h-6 text-red-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Miniatures avec effet 3D */}
            <div className="grid grid-cols-6 gap-2">
              {village.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square glass-effect rounded-xl p-2 transition-all duration-300 transform hover:scale-105 ${
                    index === currentImageIndex 
                      ? 'border-2 border-primary shadow-neon' 
                      : 'border border-white/10 hover:border-primary/50'
                  }`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-primary" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section informations */}
          <div className="space-y-6">
            {/* Titre et prix */}
            <div className="glass-effect rounded-2xl p-6 card-3d">
              <h1 className="text-2xl font-bold text-white mb-4">{village.title}</h1>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{village.rating}</span>
                    <span className="text-sm text-muted-foreground">({village.reviews} avis)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-green-400 font-medium">Livraison {village.delivery}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-primary">€{village.price}</span>
                  {village.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      €{village.originalPrice}
                    </span>
                  )}
                </div>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-white font-bold px-8 py-3 transform hover:scale-105 transition-all duration-300 shadow-neon"
                >
                  Acheter Maintenant
                </Button>
              </div>
            </div>

            {/* CocMarket Verified - Changé de iGV */}
            {village.igvVerified && (
              <div className="glass-effect rounded-2xl p-4 card-3d border border-primary/30">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary text-white px-3 py-1 rounded-lg font-bold text-sm">
                    🔒 CocMarket VERIFIED
                  </div>
                  <div>
                    <p className="font-bold text-white">This account has been verified by CocMarket!</p>
                    <p className="text-sm text-muted-foreground">Verification time: {village.verificationDate}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Onglets - Interface révolutionnaire */}
            <div className="glass-effect rounded-2xl overflow-hidden card-3d">
              <div className="flex border-b border-white/10">
                {[
                  { id: "description", label: "Description", icon: Info },
                  { id: "characteristics", label: "Caractéristiques", icon: CheckCircle }
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center space-x-2 p-4 transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-primary/20 text-primary border-b-2 border-primary'
                          : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-6">
                {activeTab === "description" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-primary">Seller Description</h3>
                    <div className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
                      {village.sellerDescription}
                    </div>
                  </div>
                )}

                {activeTab === "characteristics" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-primary">Caractéristiques du Compte</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(village.characteristics).map(([key, value]) => (
                        <div key={key} className="glass-effect rounded-lg p-3 card-3d-mini">
                          <p className="text-xs text-muted-foreground font-medium">{key}</p>
                          <p className="font-bold text-primary">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};