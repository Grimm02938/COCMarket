import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, MessageCircle, Heart, Star, Package, Shield, Verified } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SellerProfileProps {
  sellerId: string;
}

interface SellerStats {
  products_count: number;
  average_rating: number;
  total_reviews: number;
}

interface Seller {
  id: string;
  username: string;
  display_name?: string;
  email: string;
  location: string;
  location_display?: string;
  avatar?: string;
  trust_score: number;
  total_sales: number;
  member_since: string;
  is_verified: boolean;
  badges: string[];
  bio?: string;
  is_online: boolean;
}

interface SellerProfileData {
  seller: Seller;
  stats: SellerStats;
}

export const SellerProfile: React.FC<SellerProfileProps> = ({ sellerId }) => {
  const [profileData, setProfileData] = useState<SellerProfileData | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        console.log('🌐 Fetching seller profile from:', `${backendUrl}/api/sellers/${sellerId}/profile`);
        const response = await fetch(`${backendUrl}/api/sellers/${sellerId}/profile`);
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
          console.log('✅ Seller profile data:', data);
        } else {
          console.error('❌ Failed to fetch seller profile:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching seller profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProfile();
  }, [sellerId]);

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto mb-8">
        <div className="glass-effect rounded-2xl p-6 animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-20 h-20 bg-gray-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="w-full max-w-2xl mx-auto mb-8">
        <div className="glass-effect rounded-2xl p-6 text-center">
          <p className="text-gray-400">Profil vendeur non trouvé</p>
        </div>
      </div>
    );
  }

  const { seller, stats } = profileData;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  };

  const getLocationFlag = (location: string) => {
    switch (location.toLowerCase()) {
      case 'fr': return '🇫🇷';
      case 'eu': return '🇪🇺';
      case 'na': return '🇺🇸';
      case 'asia': return '🌏';
      default: return '🌍';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
        
        {/* Header with futuristic design */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 border-b border-gray-700/50">
          <div className="flex items-start space-x-6">
            
            {/* Avatar with status indicator */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                {seller.avatar ? (
                  <img 
                    src={seller.avatar} 
                    alt={seller.username}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="text-2xl font-bold text-white">
                    {seller.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* Online status */}
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-slate-800 flex items-center justify-center ${
                seller.is_online ? 'bg-green-400' : 'bg-gray-500'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  seller.is_online ? 'bg-green-500' : 'bg-gray-600'
                }`}></div>
              </div>
            </div>

            {/* Profile info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-white">
                  {seller.display_name || seller.username}
                </h2>
                {seller.is_verified && (
                  <div className="flex items-center space-x-1">
                    <Verified className="w-5 h-5 text-blue-400" />
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">
                      Vérifié
                    </Badge>
                  </div>
                )}
              </div>

              {/* Location and member since with futuristic styling */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-gray-300">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">
                    {getLocationFlag(seller.location)} {seller.location_display || seller.location.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-300">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">
                    Membre depuis {formatDate(seller.member_since)}
                  </span>
                </div>
              </div>

              {/* Trust score and badges */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-lg font-bold text-white">{seller.trust_score}</span>
                  <span className="text-sm text-gray-400">({stats.total_reviews} avis)</span>
                </div>
                
                <div className="h-4 w-px bg-gray-600"></div>
                
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">{stats.products_count} produits</span>
                </div>
              </div>

              {/* Badges */}
              {seller.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {seller.badges.map((badge, index) => (
                    <Badge
                      key={index}
                      className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border-purple-400/30 text-xs"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons with futuristic styling */}
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-blue-400/25 transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contacter
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setIsLiked(!isLiked)}
              className={`border-2 transition-all duration-300 ${
                isLiked 
                  ? 'border-pink-500 bg-pink-500/20 text-pink-400 hover:bg-pink-500/30' 
                  : 'border-gray-600 text-gray-300 hover:border-pink-500 hover:text-pink-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Bio section */}
          {seller.bio && (
            <div className="mt-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
              <p className="text-gray-300 text-sm leading-relaxed">{seller.bio}</p>
            </div>
          )}
        </div>

        {/* Trust score visualization */}
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-gray-200">Trust Score</span>
              </div>
              <span className="text-lg font-bold text-green-400">{seller.trust_score}/5.0</span>
            </div>
            
            <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${(seller.trust_score / 5) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Nouveau</span>
              <span>Excellent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};