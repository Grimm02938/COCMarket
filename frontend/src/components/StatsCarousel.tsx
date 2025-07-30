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

      {/* Stats carousel avec effet 3D */}
      <div className="perspective-1000">
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-all duration-1000 ease-in-out transform-gpu"
            style={{ 
              transform: `translateX(-${currentIndex * 20}%) rotateY(${currentIndex * -2}deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            {statsData.map((stat, index) => {
              const StatIcon = stat.icon;
              const isActive = index === currentIndex;
              const offset = index - currentIndex;
              
              return (
                <div
                  key={index}
                  className={`flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/5 px-2 transition-all duration-1000 transform-gpu ${
                    isActive ? 'scale-110 z-10' : 'scale-95 opacity-60'
                  }`}
                  style={{
                    transform: `
                      perspective(1000px) 
                      rotateY(${offset * 15}deg) 
                      translateZ(${isActive ? '50px' : '0px'})
                      translateX(${offset * -10}px)
                    `,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div className="glass-effect rounded-2xl p-6 h-32 flex flex-col items-center justify-center text-center group hover:shadow-neon transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 space-y-2">
                      <div className="w-8 h-8 mx-auto text-primary group-hover:text-cyan-400 transition-colors duration-300 floating">
                        <StatIcon className="w-full h-full" />
                      </div>
                      <div className="text-2xl font-bold text-gradient">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
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