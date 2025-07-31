import { useState, useEffect } from "react";
import { Shield, Users, Star, Clock, Zap } from "lucide-react";

const statsData = [
  { label: "Comptes vendus", value: "5,000+", icon: Users },
  { label: "Satisfaction client", value: "99.9%", icon: Star },
  { label: "Villages disponibles", value: "500+", icon: Shield },
  { label: "Support 24/7", value: "100%", icon: Clock },
  { label: "Livraison rapide", value: "<5min", icon: Zap },
];

export const StatsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % statsData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + statsData.length) % statsData.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % statsData.length);
  };

  const IconComponent = statsData[currentIndex].icon;

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden">
      {/* Message redirection vers le bas - AMÉLIORÉ */}
      <div className="text-center mb-8">
        <button 
          onClick={() => document.getElementById('protection-modes')?.scrollIntoView({ behavior: 'smooth' })}
          className="group flex items-center justify-center space-x-3 mx-auto px-6 py-3 bg-gradient-to-r from-primary/10 to-cyan-500/10 hover:from-primary/20 hover:to-cyan-500/20 border border-primary/30 hover:border-primary/50 rounded-2xl transition-all duration-500 transform hover:scale-105 font-semibold text-lg text-primary hover:text-cyan-400"
        >
          <span>Comment fonctionnent nos achats sécurisés ?</span>
          <div className="transform group-hover:translate-y-1 transition-transform duration-300">
            <svg 
              className="w-6 h-6 text-primary group-hover:text-cyan-400 transition-colors duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </button>
      </div>

      {/* Stats carousel avec effet 3D fluide - CORRIGER LES COUPURES */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className="relative h-40 flex items-center justify-center">
          <div className="flex items-center justify-center space-x-12">
            {/* Affichage circulaire fluide sans coupures */}
            {[0, 1, 2].map((offset) => {
              const index = (currentIndex + offset) % statsData.length;
              const stat = statsData[index];
              const StatIcon = stat.icon;
              const isCenter = offset === 1;
              
              return (
                <div
                  key={`${index}-${currentIndex}`}
                  className={`transition-all duration-700 ease-out transform-gpu ${
                    isCenter ? 'scale-110 z-20 opacity-100' : 'scale-90 opacity-60 z-10'
                  }`}
                  style={{
                    transform: `
                      translateX(${(offset - 1) * 80}px)
                      translateZ(${isCenter ? '20px' : '0px'})
                      scale(${isCenter ? '1.1' : '0.9'})
                    `,
                    transformStyle: 'preserve-3d',
                    transition: 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div className={`glass-effect rounded-2xl p-6 w-64 h-32 flex flex-col items-center justify-center text-center group hover:shadow-neon transition-all duration-500 ${
                    isCenter ? 'shadow-neon border border-primary/30 bg-gradient-to-br from-primary/10 to-cyan-500/10' : 'bg-gradient-to-br from-gray-900/50 to-gray-800/50'
                  }`}>
                    
                    <div className="relative z-10 space-y-2">
                      <div className={`w-8 h-8 mx-auto transition-all duration-500 ${
                        isCenter ? 'text-primary scale-110' : 'text-muted-foreground'
                      }`}>
                        <StatIcon className="w-full h-full animate-pulse" />
                      </div>
                      <div className={`text-2xl font-bold transition-all duration-500 ${
                        isCenter ? 'text-white text-gradient' : 'text-muted-foreground'
                      }`}>
                        {stat.value}
                      </div>
                      <div className={`text-xs transition-all duration-500 ${
                        isCenter ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        {stat.label}
                      </div>
                    </div>

                    {/* Effet de brillance pour le slide actif */}
                    {isCenter && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse rounded-2xl"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center mt-6 space-x-3">
        {statsData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-500 transform hover:scale-125 ${
              index === currentIndex 
                ? 'bg-gradient-to-r from-primary to-cyan-500 w-8 shadow-neon' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};