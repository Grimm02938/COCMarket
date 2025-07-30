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
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-2">
          Avis Clients Certifiés
        </h2>
        <p className="text-muted-foreground">
          Témoignages vérifiés de nos clients satisfaits
        </p>
      </div>

      <div className="glass-effect rounded-3xl p-8 card-3d hover:shadow-2xl transition-all duration-500">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Screenshot du village */}
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-cyan-500/20 p-4">
              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center">
                <GamepadIcon className="w-16 h-16 text-primary opacity-50" />
                <div className="absolute top-4 left-4 text-xs bg-primary/20 px-2 py-1 rounded-full">
                  {review.village}
                </div>
              </div>
            </div>
            
            {/* Features du compte */}
            <div className="mt-4 space-y-2">
              {review.accountFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contenu de l'avis */}
          <div className="space-y-6">
            {/* Rating */}
            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} 
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {review.rating}/5
              </span>
            </div>

            {/* Commentaire */}
            <blockquote className="text-lg leading-relaxed">
              "{review.comment}"
            </blockquote>

            {/* User info */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {review.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{review.username}</span>
                  {review.verified && (
                    <Shield className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  Achat vérifié
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {reviewsData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReview(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentReview 
                  ? 'bg-primary w-8' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};