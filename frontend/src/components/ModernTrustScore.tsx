
import { Star } from "lucide-react";

export const ModernTrustScore = () => {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="glass-effect rounded-xl p-4 relative overflow-hidden border border-white/10">
        {/* Background gradient - moins prononcé */}
        <div className="absolute inset-0 bg-green-500/5"></div>
        
        <div className="relative flex items-center space-x-3">
          {/* Stars - plus petites */}
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="w-4 h-4 text-green-400 fill-current" 
              />
            ))}
          </div>

          {/* Score and reviews - plus compact */}
          <div className="flex-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-white">4.9</span>
              <span className="text-green-400 font-medium text-sm">Trustscore</span>
            </div>
            <div className="text-xs text-muted-foreground">
              200+ reviews
            </div>
          </div>

          {/* Logo CocMarket - plus petit */}
          <div className="w-8 h-6 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">CM</span>
          </div>
        </div>

        {/* Rating distribution bar - plus fine */}
        <div className="mt-3 flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="h-1 bg-green-400 rounded-full flex-1 opacity-80"
              style={{ 
                width: i === 4 ? '90%' : '8%',
                opacity: i === 4 ? 1 : 0.3 
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
