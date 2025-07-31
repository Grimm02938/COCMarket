
import { useState, useEffect } from "react";
import { Star, Shield, GamepadIcon } from "lucide-react";

const reviewsData = [
  {
    id: 1,
    username: "Alex_Gaming",
    village: "Château Moderne",
    rating: 5,
    comment: "Village incroyable ! Exactement comme décrit, livraison ultra rapide.",
    accountFeatures: ["Château niveau 10", "1M de pièces", "Tous les objets rares"],
    screenshot: "/lovable-uploads/village1.jpg",
    verified: true,
  },
  {
    id: 2,
    username: "Sophie2024",
    village: "Village Fantastique",
    rating: 5,
    comment: "Service parfait, vendeur de confiance. Je recommande vivement !",
    accountFeatures: ["Village complet", "500K pièces", "Objets exclusifs"],
    screenshot: "/lovable-uploads/village2.jpg",
    verified: true,
  },
  {
    id: 3,
    username: "ProPlayer_FR",
    village: "Méga Cité",
    rating: 5,
    comment: "Transaction sécurisée, compte exactement comme promis. Merci !",
    accountFeatures: ["Méga village", "2M de pièces", "Collection complète"],
    screenshot: "/lovable-uploads/village3.jpg",
    verified: true,
  },
];

export const CertifiedReviews = () => {
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviewsData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const review = reviewsData[currentReview];

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-2">
          Avis Clients Certifiés
        </h2>
        <p className="text-muted-foreground">
          Témoignages vérifiés de nos clients satisfaits
        </p>
      </div>

      {/* Container simplifié sans 3D */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ 
            transform: `translateX(-${currentReview * 100}%)`,
          }}
        >
          {reviewsData.map((reviewItem, index) => (
            <div
              key={reviewItem.id}
              className="w-full flex-shrink-0 px-4"
            >
              <div className="glass-effect rounded-2xl p-4 md:p-8 border border-white/10 hover:border-white/20 transition-colors duration-300">
                {/* Layout responsive - vertical sur mobile, horizontal sur desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center">
                  
                  {/* Screenshot simplifié */}
                  <div className="order-2 lg:order-1">
                    <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-cyan-500/20 p-3 lg:p-4">
                      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center relative">
                        <GamepadIcon className="w-8 h-8 lg:w-16 lg:h-16 text-primary opacity-50" />
                        <div className="absolute top-2 left-2 text-xs bg-primary/20 backdrop-blur-sm px-2 py-1 rounded-full border border-primary/20">
                          {reviewItem.village}
                        </div>
                      </div>
                    </div>
                    
                    {/* Features compactes */}
                    <div className="mt-3 space-y-1">
                      {reviewItem.accountFeatures.slice(0, 2).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2 text-xs">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contenu avis simplifié */}
                  <div className="order-1 lg:order-2 space-y-4">
                    {/* Rating compact */}
                    <div className="flex items-center space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < reviewItem.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-muted-foreground'
                          }`} 
                        />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {reviewItem.rating}/5
                      </span>
                    </div>

                    {/* Commentaire compact */}
                    <blockquote className="text-sm lg:text-base leading-relaxed">
                      "{reviewItem.comment}"
                    </blockquote>

                    {/* User info compact */}
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {reviewItem.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{reviewItem.username}</span>
                          {reviewItem.verified && (
                            <Shield className="w-3 h-3 text-green-400" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Client certifié
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation dots simplifiée */}
      <div className="flex justify-center mt-6 space-x-2">
        {reviewsData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentReview(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentReview 
                ? 'bg-primary w-6' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
