import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, TrendingUp, Shield, Zap, Users, Award, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FuturisticHeader from '@/components/FuturisticHeader';

interface GameProduct {
  id: string;
  title: string;
  category: string;
  game_name: string;
  price: number;
  original_price?: number;
  condition: string;
  location: string;
  is_featured: boolean;
  level?: number;
  rank?: string;
  view_count: number;
  favorite_count: number;
}

interface MarketStats {
  total_products: number;
  total_sales: number;
  average_price: number;
  trending_games: string[];
  featured_products: GameProduct[];
}

const CocMarketHomepage = () => {
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<GameProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Initialize sample data first
        await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/init-sample-data`, {
          method: 'POST'
        });

        // Fetch market stats and featured products
        const [statsRes, productsRes] = await Promise.all([
          fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/market-stats`),
          fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/products?featured_only=true&limit=4`)
        ]);

        const stats = await statsRes.json();
        const products = await productsRes.json();

        setMarketStats(stats);
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [
    {
      name: 'Comptes Gaming',
      category: 'accounts',
      icon: '👤',
      description: 'Comptes high-level avec skins rares',
      gradient: 'from-purple-500 to-blue-500',
      image: 'https://images.unsplash.com/photo-1588571514255-2fc4ece58dd4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwZ2FtaW5nfGVufDB8fHxibHVlfDE3NTM5NTEyOTF8MA&ixlib=rb-4.1.0&q=85'
    },
    {
      name: 'Objets & Items',
      category: 'items',
      icon: '⚔️',
      description: 'Armes légendaires et équipements',
      gradient: 'from-orange-500 to-red-500',
      image: 'https://images.pexels.com/photos/8728559/pexels-photo-8728559.jpeg'
    },
    {
      name: 'Skins & Cosmétiques',
      category: 'skins',
      icon: '🎨',
      description: 'Skins exclusifs et collectibles',
      gradient: 'from-pink-500 to-purple-500',
      image: 'https://images.unsplash.com/photo-1552668355-4f6d28b9dc7e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9ufGVufDB8fHxibHVlfDE3NTM5NTEyOTd8MA&ixlib=rb-4.1.0&q=85'
    },
    {
      name: 'Services & Boosting',
      category: 'boosting',
      icon: '🚀',
      description: 'Boost de rang et services pro',
      gradient: 'from-blue-500 to-teal-500',
      image: 'https://images.unsplash.com/photo-1588007374946-c79543903e8a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxjeWJlcnB1bmslMjBuZW9ufGVufDB8fHxibHVlfDE3NTM5NTEyOTd8MA&ixlib=rb-4.1.0&q=85'
    }
  ];

  const trustFeatures = [
    {
      icon: Shield,
      title: 'Paiement Sécurisé',
      description: 'Transactions protégées par cryptage SSL',
      color: 'text-green-400'
    },
    {
      icon: Zap,
      title: 'Livraison Instantanée',
      description: 'Réception immédiate de vos achats',
      color: 'text-yellow-400'
    },
    {
      icon: Users,
      title: 'Communauté Vérifiée',
      description: 'Vendeurs certifiés et avis authentiques',
      color: 'text-blue-400'
    },
    {
      icon: Award,
      title: 'Garantie Satisfait',
      description: 'Remboursement sous 7 jours',
      color: 'text-purple-400'
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement de CocMarket...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <FuturisticHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1552668355-4f6d28b9dc7e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9ufGVufDB8fHxibHVlfDE3NTM5NTEyOTd8MA&ixlib=rb-4.1.0&q=85"
            alt="Cyberpunk Gaming Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-400/30">
              <TrendingUp className="w-4 h-4 mr-2" />
              Marketplace #1 Gaming France
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                La Marketplace
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                Gaming du Futur
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Découvrez des milliers de comptes, objets rares et services gaming. 
              Transactions sécurisées, livraison instantanée, communauté vérifiée.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl"
              >
                Explorer les offres
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3 rounded-xl"
              >
                Comment ça marche
              </Button>
            </div>

            {/* Quick Stats */}
            {marketStats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-blue-400">{marketStats.total_products}+</div>
                  <div className="text-sm text-gray-400">Produits disponibles</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-green-400">24/7</div>
                  <div className="text-sm text-gray-400">Support client</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-orange-400">100%</div>
                  <div className="text-sm text-gray-400">Transactions sécurisées</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-purple-400">{formatPrice(marketStats.average_price)}</div>
                  <div className="text-sm text-gray-400">Prix moyen</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl animate-pulse"></div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Catégories Gaming
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explorez notre sélection de produits gaming pour tous les joueurs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card
                key={category.category}
                className="group bg-black/40 backdrop-blur-lg border-gray-800 hover:border-gray-600 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60`}></div>
                  <div className="absolute inset-0 bg-black/40"></div>
                  
                  <div className="absolute top-4 left-4">
                    <div className="text-3xl mb-2">{category.icon}</div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-200 opacity-90">{category.description}</p>
                  </div>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ChevronRight className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-gray-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Produits Vedettes
                </span>
              </h2>
              <p className="text-gray-400 text-lg">Les meilleures offres sélectionnées pour vous</p>
            </div>
            <Button variant="outline" className="hidden lg:flex border-gray-600 text-white hover:bg-gray-800">
              Voir tout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group bg-black/40 backdrop-blur-lg border-gray-800 hover:border-blue-500/50 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-400/30">
                      {getCategoryIcon(product.category)} {product.category.toUpperCase()}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-400">
                      <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                      Featured
                    </div>
                  </div>

                  <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {product.title}
                  </h3>

                  <div className="text-sm text-gray-400 mb-3">
                    🎮 {product.game_name}
                    {product.level && <span className="ml-2">• Niveau {product.level}</span>}
                    {product.rank && <span className="ml-2">• {product.rank}</span>}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xl font-bold text-white">
                        {formatPrice(product.price)}
                      </div>
                      {product.original_price && (
                        <div className="text-sm text-gray-400 line-through">
                          {formatPrice(product.original_price)}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-xs text-gray-400">
                      👁️ {product.view_count} vues
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    size="sm"
                  >
                    Voir l'offre
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 lg:hidden">
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
              Voir tous les produits
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Pourquoi CocMarket ?
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              La plateforme gaming de confiance avec les meilleures garanties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900/50 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Prêt à explorer CocMarket ?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Rejoignez des milliers de gamers qui font confiance à notre marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-12 py-4 rounded-xl"
            >
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-gray-600 text-white hover:bg-gray-800 px-12 py-4 rounded-xl"
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-orange-400 rounded-lg"></div>
                <span className="text-xl font-bold text-white">CocMarket</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                La marketplace gaming de nouvelle génération. Sécurisé, rapide, fiable.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700">
                  <span className="text-xs">📘</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700">
                  <span className="text-xs">🐦</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700">
                  <span className="text-xs">📷</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Catégories</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/products?category=accounts" className="hover:text-white">Comptes Gaming</a></li>
                <li><a href="/products?category=items" className="hover:text-white">Objets & Items</a></li>
                <li><a href="/products?category=skins" className="hover:text-white">Skins</a></li>
                <li><a href="/products?category=boosting" className="hover:text-white">Services</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/faq" className="hover:text-white">FAQ</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
                <li><a href="/support" className="hover:text-white">Support 24/7</a></li>
                <li><a href="/refund" className="hover:text-white">Remboursements</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/terms" className="hover:text-white">CGU</a></li>
                <li><a href="/privacy" className="hover:text-white">Confidentialité</a></li>
                <li><a href="/security" className="hover:text-white">Sécurité</a></li>
                <li><a href="/legal" className="hover:text-white">Mentions légales</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 CocMarket. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Paiements sécurisés SSL</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CocMarketHomepage;