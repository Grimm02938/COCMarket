import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, Eye, Heart, Shield, Truck, MessageCircle, TrendingUp, 
  ArrowLeft, Share2, Flag, CheckCircle, Clock, Users, Award,
  ChevronLeft, ChevronRight, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import FuturisticHeader from '@/components/FuturisticHeader';
import { RealisticTrustScore } from '@/components/RealisticTrustScore';
import { createCheckoutSession, redirectToCheckout } from '@/services/stripeService';

interface GameProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  game_name: string;
  price: number;
  original_price?: number;
  condition: string;
  location: string;
  seller_id: string;
  is_featured: boolean;
  level?: number;
  rank?: string;
  stats: any;
  view_count: number;
  favorite_count: number;
  created_at: string;
}

interface Review {
  id: string;
  reviewer_username: string;
  rating: number;
  comment: string;
  created_at: string;
  is_verified_purchase: boolean;
}

interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_breakdown: { [key: string]: number };
}

interface PriceHistory {
  price: number;
  timestamp: string;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<GameProduct | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProductData(id);
    }
  }, [id]);

  const handlePurchase = async () => {
    if (!product) return;
    
    setIsProcessingPayment(true);
    
    try {
      console.log('Starting purchase process for product:', product.id);
      
      const currentUrl = window.location.origin;
      const paymentData = {
        product_id: product.id,
        success_url: `${currentUrl}/payment-success?product_id=${product.id}`,
        cancel_url: `${currentUrl}/products/${product.id}`,
      };

      console.log('Payment data:', paymentData);
      const session = await createCheckoutSession(paymentData);
      
      if (!session || !session.checkout_session_id) {
        throw new Error('Session de paiement invalide reçue du serveur');
      }
      
      console.log('Redirecting to Stripe checkout...');
      await redirectToCheckout(session.checkout_session_id);
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      alert(`Erreur lors de l'initialisation du paiement: ${errorMessage}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const fetchProductData = async (productId: string) => {
    setLoading(true);
    try {
      const [productRes, reviewsRes, reviewStatsRes, priceHistoryRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}/reviews`),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}/reviews/stats`),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}/price-history`)
      ]);

      if (productRes.ok) {
        const productData = await productRes.json();
        setProduct(productData);
      }

      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      }

      if (reviewStatsRes.ok) {
        const statsData = await reviewStatsRes.json();
        setReviewStats(statsData);
      }

      if (priceHistoryRes.ok) {
        const historyData = await priceHistoryRes.json();
        setPriceHistory(historyData);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      accounts: '👤',
      items: '⚔️',
      skins: '🎨',
      currency: '💎',
      boosting: '🚀',
      characters: '🦸'
    };
    return icons[category] || '🎮';
  };

  const getConditionColor = (condition: string) => {
    const colors: { [key: string]: string } = {
      new: 'bg-green-500/20 text-green-400 border-green-400/30',
      excellent: 'bg-blue-500/20 text-blue-400 border-blue-400/30',
      good: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30',
      fair: 'bg-orange-500/20 text-orange-400 border-orange-400/30'
    };
    return colors[condition] || 'bg-gray-500/20 text-gray-400 border-gray-400/30';
  };

  const getConditionLabel = (condition: string) => {
    const labels: { [key: string]: string } = {
      new: 'Neuf',
      excellent: 'Excellent',
      good: 'Bon état',
      fair: 'Correct'
    };
    return labels[condition] || condition;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <FuturisticHeader />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement du produit...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black">
        <FuturisticHeader />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Produit non trouvé</h1>
            <Button onClick={() => navigate('/products')} variant="outline">
              Retour aux produits
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Sample images for demonstration
  const productImages = [
    'https://images.unsplash.com/photo-1588571514255-2fc4ece58dd4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwZ2FtaW5nfGVufDB8fHxibHVlfDE3NTM5NTEyOTF8MA&ixlib=rb-4.1.0&q=85',
    'https://images.pexels.com/photos/8728559/pexels-photo-8728559.jpeg',
    'https://images.unsplash.com/photo-1552668355-4f6d28b9dc7e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9ufGVufDB8fHxibHVlfDE3NTM5NTEyOTd8MA&ixlib=rb-4.1.0&q=85'
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <FuturisticHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-400 mb-6">
          <button onClick={() => navigate('/products')} className="hover:text-white">
            Produits
          </button>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-white">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-900/50 rounded-xl overflow-hidden">
              <img
                src={productImages[selectedImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Navigation */}
            <div className="flex space-x-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-blue-400' : 'border-gray-700'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30">
                  {getCategoryIcon(product.category)} {product.category.toUpperCase()}
                </Badge>
                {product.is_featured && (
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-400/30">
                    ⭐ Featured
                  </Badge>
                )}
                <Badge className={getConditionColor(product.condition)}>
                  {getConditionLabel(product.condition)}
                </Badge>
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>🎮 {product.game_name}</span>
                {product.level && <span>• Niveau {product.level}</span>}
                {product.rank && <span>• {product.rank}</span>}
                <span>• {product.location === 'fr' ? '🇫🇷 France' : '🌍 International'}</span>
              </div>
            </div>

            {/* Price & Stats */}
            <div className="bg-gray-900/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-white">
                    {formatPrice(product.price)}
                  </div>
                  {product.original_price && (
                    <div className="text-lg text-gray-400 line-through">
                      {formatPrice(product.original_price)}
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <Eye className="w-4 h-4" />
                    {product.view_count} vues
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Heart className="w-4 h-4" />
                    {product.favorite_count} favoris
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <Shield className="w-6 h-6 text-green-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-400">Sécurisé</div>
                </div>
                <div className="text-center">
                  <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-400">Instantané</div>
                </div>
                <div className="text-center">
                  <CheckCircle className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-400">Garanti</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handlePurchase}
                  disabled={isProcessingPayment || !product.is_available}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  {isProcessingPayment 
                    ? 'Redirection vers le paiement...' 
                    : product.is_available 
                      ? `Acheter maintenant - ${formatPrice(product.price)}` 
                      : 'Produit non disponible'
                  }
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                    <Heart className="w-4 h-4 mr-2" />
                    Favoris
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager
                  </Button>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <Card className="bg-black/40 backdrop-blur-lg border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400">
                      <AvatarFallback className="text-white font-bold">
                        G
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-white">GamerPro2024</div>
                      <div className="text-sm text-gray-400">Vendeur vérifié</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      {renderStars(5)}
                      <span className="text-sm text-gray-400 ml-2">(4.8)</span>
                    </div>
                    <div className="text-xs text-gray-400">15 ventes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust Score Section */}
        <div className="mt-8 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Confiance et Sécurité CocMarket</h3>
            <p className="text-gray-400">Notre score de confiance basé sur les avis vérifiés de nos utilisateurs</p>
          </div>
          <RealisticTrustScore size="medium" />
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-900/50">
              <TabsTrigger value="description" className="text-white data-[state=active]:bg-blue-500">
                Description
              </TabsTrigger>
              <TabsTrigger value="stats" className="text-white data-[state=active]:bg-blue-500">
                Statistiques
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-white data-[state=active]:bg-blue-500">
                Avis ({reviewStats?.total_reviews || 0})
              </TabsTrigger>
              <TabsTrigger value="market" className="text-white data-[state=active]:bg-blue-500">
                Données marché
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card className="bg-black/40 backdrop-blur-lg border-gray-800">
                <CardContent className="p-6">
                  <p className="text-gray-300 leading-relaxed">
                    {product.description}
                  </p>
                  
                  {/* Additional Details */}
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Catégorie</div>
                      <div className="text-white font-medium">{product.category}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Jeu</div>
                      <div className="text-white font-medium">{product.game_name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">État</div>
                      <div className="text-white font-medium">{getConditionLabel(product.condition)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Localisation</div>
                      <div className="text-white font-medium">
                        {product.location === 'fr' ? '🇫🇷 France' : '🌍 International'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="mt-6">
              <Card className="bg-black/40 backdrop-blur-lg border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Statistiques du produit</h3>
                  
                  {product.stats && Object.keys(product.stats).length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(product.stats).map(([key, value]) => (
                        <div key={key} className="text-center p-4 bg-gray-900/30 rounded-lg">
                          <div className="text-xl font-bold text-blue-400 mb-1">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                          </div>
                          <div className="text-sm text-gray-400 capitalize">
                            {key.replace('_', ' ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">Aucune statistique disponible pour ce produit.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Review Stats */}
                {reviewStats && reviewStats.total_reviews > 0 && (
                  <Card className="bg-black/40 backdrop-blur-lg border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <div className="text-3xl font-bold text-white mb-1">
                            {reviewStats.average_rating.toFixed(1)}
                          </div>
                          <div className="flex items-center gap-1 mb-1">
                            {renderStars(Math.round(reviewStats.average_rating))}
                          </div>
                          <div className="text-sm text-gray-400">
                            {reviewStats.total_reviews} avis
                          </div>
                        </div>

                        {/* Rating Breakdown */}
                        <div className="space-y-2 min-w-[200px]">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-2">
                              <span className="text-sm text-gray-400 w-6">{rating}</span>
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              <Progress 
                                value={((reviewStats.rating_breakdown[rating] || 0) / reviewStats.total_reviews) * 100}
                                className="flex-1 h-2"
                              />
                              <span className="text-xs text-gray-400 w-8">
                                {reviewStats.rating_breakdown[rating] || 0}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <Card key={review.id} className="bg-black/40 backdrop-blur-lg border-gray-800">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400">
                                <AvatarFallback className="text-white font-bold">
                                  {review.reviewer_username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-white">{review.reviewer_username}</div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    {renderStars(review.rating)}
                                  </div>
                                  {review.is_verified_purchase && (
                                    <Badge className="bg-green-500/20 text-green-400 border-green-400/30 text-xs">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Achat vérifié
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-400">
                              {formatDate(review.created_at)}
                            </div>
                          </div>
                          
                          <p className="text-gray-300">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="bg-black/40 backdrop-blur-lg border-gray-800">
                      <CardContent className="p-6 text-center">
                        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">Aucun avis pour ce produit.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="market" className="mt-6">
              <Card className="bg-black/40 backdrop-blur-lg border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                    Données de marché
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {priceHistory.length > 0 ? (
                    <div className="space-y-4">
                      <div className="text-sm text-gray-400">
                        Historique des prix (30 derniers jours)
                      </div>
                      
                      <div className="space-y-2">
                        {priceHistory.slice(0, 5).map((entry, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                            <div className="text-white">{formatPrice(entry.price)}</div>
                            <div className="text-sm text-gray-400">{formatDate(entry.timestamp)}</div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Market Insights */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="text-center p-4 bg-gray-900/30 rounded-lg">
                          <div className="text-lg font-bold text-green-400">
                            {formatPrice(Math.min(...priceHistory.map(p => p.price)))}
                          </div>
                          <div className="text-sm text-gray-400">Prix le plus bas</div>
                        </div>
                        <div className="text-center p-4 bg-gray-900/30 rounded-lg">
                          <div className="text-lg font-bold text-red-400">
                            {formatPrice(Math.max(...priceHistory.map(p => p.price)))}
                          </div>
                          <div className="text-sm text-gray-400">Prix le plus haut</div>
                        </div>
                        <div className="text-center p-4 bg-gray-900/30 rounded-lg">
                          <div className="text-lg font-bold text-blue-400">
                            {formatPrice(priceHistory.reduce((sum, p) => sum + p.price, 0) / priceHistory.length)}
                          </div>
                          <div className="text-sm text-gray-400">Prix moyen</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">Aucune donnée de marché disponible.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;