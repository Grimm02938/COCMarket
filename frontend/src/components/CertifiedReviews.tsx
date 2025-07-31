
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
    <div className="w-full max-w-6xl mx-auto p-6">{/* Agrandi légèrement */}

      {/* Container simplifié sans 3D - AGRANDI */}
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
              <div className="glass-effect rounded-2xl p-6 md:p-10 border border-white/10 hover:border-white/20 transition-colors duration-300">{/* Padding augmenté */}
                {/* Layout responsive - vertical sur mobile, horizontal sur desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">{/* Gap augmenté */}
                  
                  {/* Screenshot agrandi */}
                  <div className="order-2 lg:order-1">
                    <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-cyan-500/20 p-4 lg:p-5">{/* Padding augmenté */}
                      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center relative">
                        <GamepadIcon className="w-10 h-10 lg:w-20 lg:h-20 text-primary opacity-50" />{/* Icône agrandie */}
                        <div className="absolute top-3 left-3 text-sm bg-primary/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary/20">{/* Agrandi */}
                          {reviewItem.village}
                        </div>
                      </div>
                    </div>
                    
                    {/* Features plus visibles */}
                    <div className="mt-4 space-y-2">{/* Spacing augmenté */}
                      {reviewItem.accountFeatures.slice(0, 2).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2 text-sm">{/* Taille texte augmentée */}
                          <div className="w-2 h-2 bg-primary rounded-full"></div>{/* Point agrandi */}
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contenu avis agrandi */}
                  <div className="order-1 lg:order-2 space-y-5">{/* Spacing augmenté */}
                    {/* Rating plus visible */}
                    <div className="flex items-center space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${/* Taille augmentée */
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

                    {/* Commentaire plus visible */}
                    <blockquote className="text-base lg:text-lg leading-relaxed">{/* Taille augmentée */}
                      "{reviewItem.comment}"
                    </blockquote>

                    {/* User info agrandi */}
                    <div className="flex items-center space-x-4">{/* Spacing augmenté */}
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-cyan-500 rounded-full flex items-center justify-center">{/* Taille augmentée */}
                        <span className="text-white font-medium">
                          {reviewItem.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{reviewItem.username}</span>{/* Font normale */}
                          {reviewItem.verified && (
                            <Shield className="w-4 h-4 text-green-400" />{/* Taille augmentée */}
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">{/* Taille augmentée */}
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

      {/* Navigation dots légèrement agrandies */}
      <div className="flex justify-center mt-8 space-x-3">{/* Spacing augmenté */}
        {reviewsData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentReview(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${/* Taille augmentée */
              index === currentReview 
                ? 'bg-primary w-7' /* Largeur augmentée */
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
