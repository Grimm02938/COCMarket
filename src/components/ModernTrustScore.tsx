import { Star } from "lucide-react";

export const ModernTrustScore = () => {
  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="glass-effect rounded-2xl p-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
        
        <div className="relative flex items-center space-x-4">
          {/* Stars */}
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="w-6 h-6 text-green-400 fill-current drop-shadow-lg" 
              />
            ))}
          </div>

          {/* Score and reviews */}
          <div className="flex-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-white">4.9</span>
              <span className="text-green-400 font-medium">Trustscore</span>
            </div>
            <div className="text-sm text-muted-foreground">
              200+ reviews
            </div>
          </div>

          {/* Trustpilot-style logo placeholder */}
          <div className="w-12 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">TP</span>
          </div>
        </div>

        {/* Small indicator bar */}
        <div className="mt-4 flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="h-1 bg-green-400 rounded-full flex-1 opacity-80"
            />
          ))}
        </div>
      </div>
    </div>
  );
};