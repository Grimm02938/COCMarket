import React from 'react';
import { Star, Shield, Check } from 'lucide-react';

interface TrustScoreProps {
  score?: number;
  totalReviews?: number;
  verifiedReviews?: number;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

export const RealisticTrustScore: React.FC<TrustScoreProps> = ({
  score = 4.2,
  totalReviews = 1847,
  verifiedReviews = 1654,
  size = 'medium',
  showDetails = true
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-green-500 text-green-500" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-4 h-4">
            <Star className="w-4 h-4 text-gray-300 absolute" />
            <Star className="w-4 h-4 fill-green-500 text-green-500 absolute" 
                  style={{ clipPath: 'inset(0 50% 0 0)' }} />
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Très bien';
    if (rating >= 3.0) return 'Bien';
    if (rating >= 2.0) return 'Correct';
    return 'À améliorer';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'p-4',
          score: 'text-2xl',
          text: 'text-sm'
        };
      case 'large':
        return {
          container: 'p-8',
          score: 'text-6xl',
          text: 'text-lg'
        };
      default:
        return {
          container: 'p-6',
          score: 'text-4xl',
          text: 'text-base'
        };
    }
  };

  const classes = getSizeClasses();

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300">
        <div className={`${classes.container}`}>
          {/* Header avec badge Trustpilot-style */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-white font-semibold">TrustScore</span>
            </div>
            <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-full">
              <Check className="w-3 h-3 text-green-400" />
              <span className="text-green-400 text-xs font-medium">Vérifié</span>
            </div>
          </div>

          {/* Score principal et étoiles */}
          <div className="flex items-center space-x-4 mb-4">
            <div className={`${classes.score} font-bold text-white`}>
              {score.toFixed(1)}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1 mb-1">
                {renderStars(score)}
              </div>
              <div className="text-green-400 font-medium text-sm">
                {getRatingText(score)}
              </div>
            </div>
          </div>

          {/* Détails des avis */}
          {showDetails && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Avis vérifiés</span>
                <span className="text-white font-medium">{verifiedReviews.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Total des avis</span>
                <span className="text-white font-medium">{totalReviews.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5 mt-3">
                <div 
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${(verifiedReviews / totalReviews) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-400 text-center">
                {((verifiedReviews / totalReviews) * 100).toFixed(0)}% d'avis vérifiés
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Badge de confiance en bas */}
      <div className="flex items-center justify-center mt-3 text-xs text-gray-400">
        <span>Certifié par CocMarket Security</span>
      </div>
    </div>
  );
};