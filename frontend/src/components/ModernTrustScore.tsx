
import { Star, Shield, CheckCircle, Users, Trophy } from "lucide-react";

export const ModernTrustScore = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mb-8">
      <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500">
        
        {/* Layout horizontal pour desktop, vertical pour mobile */}
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 lg:space-x-8">
          
          {/* Score principal à gauche */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-6 h-6 text-yellow-400 fill-current" 
                  />
                ))}
              </div>
              <div className="text-4xl font-black text-white mb-1">4.9</div>
              <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">Excellence</div>
            </div>
            
            <div className="h-16 w-px bg-gray-600 hidden lg:block"></div>
            
            <div className="text-center lg:text-left">
              <div className="text-lg font-bold text-green-400 mb-1">Plateforme Certifiée</div>
              <div className="text-sm text-gray-400">200+ avis vérifiés</div>
            </div>
          </div>

          {/* Métriques de confiance au centre */}
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-xs text-gray-400">Sécurisé</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">5K+</div>
              <div className="text-xs text-gray-400">Clients</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-white">#1</div>
              <div className="text-xs text-gray-400">France</div>
            </div>
          </div>

          {/* Badge de certification à droite */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-green-400">Vérifié</div>
              <div className="text-xs text-gray-400">Gaming Market</div>
            </div>
          </div>
        </div>

        {/* Barre de progression globale */}
        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Satisfaction globale</span>
            <span className="text-sm font-bold text-green-400">99.2%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" style={{ width: '99.2%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
