
import { Star, Shield, CheckCircle } from "lucide-react";

export const ModernTrustScore = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-effect rounded-2xl p-6 relative overflow-hidden border border-green-400/30 hover:border-green-400/50 transition-all duration-500 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
        
        {/* En-tête avec icône de vérification */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-green-400">Confiance Vérifiée</span>
          </div>
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>

        {/* Score principal */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="w-5 h-5 text-yellow-400 fill-current animate-pulse" 
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-baseline justify-center space-x-2">
            <span className="text-3xl font-bold text-white">4.9</span>
            <span className="text-green-400 font-semibold">/ 5</span>
          </div>
          
          <div className="text-sm text-green-400 font-medium mt-1">
            Score de Confiance
          </div>
          
          <div className="text-xs text-muted-foreground mt-1">
            Basé sur 200+ avis vérifiés
          </div>
        </div>

        {/* Barre de progression des avis */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-muted-foreground w-8">5★</span>
            <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <span className="text-muted-foreground w-8">85%</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-muted-foreground w-8">4★</span>
            <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" style={{ width: '12%' }}></div>
            </div>
            <span className="text-muted-foreground w-8">12%</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-muted-foreground w-8">3★</span>
            <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" style={{ width: '3%' }}></div>
            </div>
            <span className="text-muted-foreground w-8">3%</span>
          </div>
        </div>

        {/* Badge CocMarket redesigné */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-400/30 rounded-full px-4 py-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="text-sm font-semibold text-blue-400">CocMarket Certifié</span>
          </div>
        </div>

        {/* Effet de brillance */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse rounded-2xl pointer-events-none"></div>
      </div>
    </div>
  );
};
