
import { Star, Shield, CheckCircle, Users, Trophy, TrendingUp } from "lucide-react";

export const ModernTrustScore = () => {
  return (
    <div className="w-full max-w-7xl mx-auto mb-8">
      <div className="bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 shadow-2xl">
        
        {/* Layout horizontal optimisé avec meilleure organisation */}
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-12">
          
          {/* Section Score Principal - MIEUX ORGANISÉE */}
          <div className="flex items-center space-x-8">
            <div className="text-center">
              {/* Étoiles avec animation */}
              <div className="flex items-center justify-center space-x-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-7 h-7 text-yellow-400 fill-current drop-shadow-lg" 
                  />
                ))}
              </div>
              <div className="text-5xl font-black text-white mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">4.9</div>
              <div className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-1">Excellence</div>
              <div className="text-xs text-gray-400">200+ avis vérifiés</div>
            </div>
            
            {/* Séparateur élégant */}
            <div className="h-24 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent hidden lg:block"></div>
            
            {/* Section Certification */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-green-400">Plateforme Certifiée</div>
                  <div className="text-xs text-gray-400">Gaming Market Leader</div>
                </div>
              </div>
            </div>
          </div>

          {/* Métriques de Performance - MIEUX ALIGNÉES */}
          <div className="flex items-center space-x-10">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-black text-blue-400 mb-1">100%</div>
              <div className="text-xs text-gray-400 font-medium">Sécurisé</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-black text-purple-400 mb-1">5K+</div>
              <div className="text-xs text-gray-400 font-medium">Clients</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-black text-orange-400 mb-1">#1</div>
              <div className="text-xs text-gray-400 font-medium">France</div>
            </div>
          </div>

          {/* Badge de Vérification Final - REDESIGNÉ */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              {/* Effet pulsant */}
              <div className="absolute inset-0 bg-green-400/30 rounded-full animate-ping"></div>
            </div>
            <div className="text-left">
              <div className="text-lg font-bold text-green-400">Vérifié</div>
              <div className="text-sm text-gray-300 font-medium">Gaming Market</div>
              <div className="text-xs text-gray-500">Certifié 2025</div>
            </div>
          </div>
        </div>

        {/* Barre de progression globale - AMÉLIORÉE */}
        <div className="mt-8 pt-6 border-t border-gray-700/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-gray-200">Satisfaction Globale</span>
            </div>
            <span className="text-lg font-bold text-green-400">99.2%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 h-3 rounded-full shadow-lg transition-all duration-1000 animate-pulse" 
              style={{ width: '99.2%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
