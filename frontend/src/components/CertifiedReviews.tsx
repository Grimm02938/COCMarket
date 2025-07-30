
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
    }, 5000); // Plus rapide et fluide

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

      <div className="perspective-1000">
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-all duration-1000 ease-in-out transform-gpu"
            style={{ 
              transform: `translateX(-${currentReview * 100}%)`,
              transformStyle: 'preserve-3d'
            }}
          >
            {reviewsData.map((reviewItem, index) => (
              <div
                key={reviewItem.id}
                className="w-full flex-shrink-0"
                style={{
                  transform: `perspective(1000px) rotateY(${index === currentReview ? '0deg' : index < currentReview ? '-10deg' : '10deg'}) translateZ(${index === currentReview ? '0px' : '-50px'})`,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="glass-effect rounded-3xl p-8 card-3d-enhanced hover:shadow-neon transition-all duration-700 transform-gpu mx-4">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Screenshot du village avec effet 3D plus prononcé */}
                    <div className="relative transform-gpu transition-transform duration-500 hover:rotateY-12">
                      <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-cyan-500/20 p-4 shadow-2xl">
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center relative">
                          <GamepadIcon className="w-16 h-16 text-primary opacity-50" />
                          <div className="absolute top-4 left-4 text-xs bg-primary/20 backdrop-blur-sm px-2 py-1 rounded-full border border-primary/20">
                            {reviewItem.village}
                          </div>
                          
                          {/* Effet de brillance */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
                         </div>
                       </div>
               
                       {/* Features du compte avec animation */}
                       <div className="mt-4 space-y-2">
                         {reviewItem.accountFeatures.map((feature, featureIndex) => (
                           <div 
                             key={featureIndex} 
                             className="flex items-center space-x-2 text-sm transform translate-x-0 hover:translate-x-2 transition-transform duration-300"
                             style={{ animationDelay: `${featureIndex * 0.1}s` }}
                           >
                             <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                             <span className="text-muted-foreground">{feature}</span>
                           </div>
                         ))}
                       </div>
                     </div>

                    {/* Contenu de l'avis avec animations fluides */}
                    <div className="space-y-6 transform-gpu">
                      {/* Rating avec animation des étoiles */}
                      <div className="flex items-center space-x-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 transition-all duration-300 hover:scale-110 ${
                              i < reviewItem.rating 
                                ? 'text-yellow-400 fill-current drop-shadow-lg animate-pulse' 
                                : 'text-muted-foreground'
                            }`} 
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {reviewItem.rating}/5
                        </span>
                      </div>

                      {/* Commentaire avec effet de typing */}
                      <blockquote className="text-lg leading-relaxed relative">
                        <div className="absolute -left-4 -top-2 text-4xl text-primary/30 font-serif">"</div>
                        <span className="relative z-10">{reviewItem.comment}</span>
                        <div className="absolute -right-4 -bottom-2 text-4xl text-primary/30 font-serif">"</div>
                      </blockquote>

                      {/* User info avec effet hover */}
                      <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-cyan-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-neon transition-shadow duration-300">
                          <span className="text-white font-medium">
                            {reviewItem.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{reviewItem.username}</span>
                            {reviewItem.verified && (
                              <Shield className="w-4 h-4 text-green-400 animate-pulse" />
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Achat vérifié • Client certifié
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

        {/* Navigation dots avec effet 3D */}
        <div className="flex justify-center mt-8 space-x-3">
          {reviewsData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReview(index)}
              className={`w-3 h-3 rounded-full transition-all duration-500 transform hover:scale-125 ${
                index === currentReview 
                  ? 'bg-gradient-to-r from-primary to-cyan-500 w-8 shadow-neon' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              style={{
                boxShadow: index === currentReview ? '0 0 20px rgba(139, 92, 246, 0.5)' : 'none'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
