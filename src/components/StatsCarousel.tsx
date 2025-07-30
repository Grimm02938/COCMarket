import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const statsData = [
  { label: "Comptes vendus", value: "5,000+", icon: "👥" },
  { label: "Satisfaction client", value: "99.9%", icon: "⭐" },
  { label: "Villages disponibles", value: "500+", icon: "🏘️" },
  { label: "Support 24/7", value: "100%", icon: "🛠️" },
  { label: "Livraison rapide", value: "<5min", icon: "⚡" },
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

  return (
    <div className="relative w-full max-w-md mx-auto glass-effect rounded-2xl p-6 neon-glow overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-cyan-500/10 opacity-50"></div>
      
      <div className="relative flex items-center justify-between">
        <button 
          onClick={goToPrevious}
          className="p-2 rounded-full bg-primary/20 hover:bg-primary/30 transition-all duration-300"
        >
          <ChevronLeft className="w-4 h-4 text-primary" />
        </button>

        <div className="flex-1 text-center px-4">
          <div className="text-3xl mb-2 floating">
            {statsData[currentIndex].icon}
          </div>
          <div className="text-3xl font-bold text-gradient mb-1">
            {statsData[currentIndex].value}
          </div>
          <div className="text-sm text-muted-foreground">
            {statsData[currentIndex].label}
          </div>
        </div>

        <button 
          onClick={goToNext}
          className="p-2 rounded-full bg-primary/20 hover:bg-primary/30 transition-all duration-300"
        >
          <ChevronRight className="w-4 h-4 text-primary" />
        </button>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {statsData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};