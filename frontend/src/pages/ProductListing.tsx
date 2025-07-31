import React, { useState, useEffect } from 'react';
import { Star, Eye, Heart, Filter, Grid, List, ChevronDown, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FuturisticHeader from '@/components/FuturisticHeader';
import AdvancedFilters from '@/components/AdvancedFilters';

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
  is_featured: boolean;
  level?: number;
  rank?: string;
  view_count: number;
  favorite_count: number;
  created_at: string;
}

interface FilterOptions {
  category: string;
  game: string;
  location: string;
  priceRange: [number, number];
  condition: string;
  featuredOnly: boolean;
}

const ProductListing = () => {
  const [products, setProducts] = useState<GameProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('created_at');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    game: '',
    location: '',
    priceRange: [0, 1000],
    condition: '',
    featuredOnly: false
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.game) params.append('game_name', filters.game);
      if (filters.location === 'fr') params.append('location', 'fr');
      if (filters.location === 'other') params.append('location', 'eu');
      if (filters.priceRange[0] > 0) params.append('min_price', filters.priceRange[0].toString());
      if (filters.priceRange[1] < 1000) params.append('max_price', filters.priceRange[1].toString());
      if (filters.condition) params.append('condition', filters.condition);
      if (filters.featuredOnly) params.append('featured_only', 'true');
      
      params.append('limit', '20');
      
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/products?${params}`);
      const data = await response.json();
      
      // Sort products
      const sortedData = [...data].sort((a, b) => {
        switch (sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'popular':
            return b.view_count - a.view_count;
          case 'featured':
            return Number(b.is_featured) - Number(a.is_featured);
          default:
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
      
      setProducts(sortedData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

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

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <FuturisticHeader />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement des produits...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <FuturisticHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <AdvancedFilters
              onFiltersChange={handleFiltersChange}
              isOpen={filtersOpen}
              onToggle={() => setFiltersOpen(!filtersOpen)}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Produits Gaming
                  </span>
                </h1>
                <p className="text-gray-400">
                  {products.length} produits trouvés
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-gray-900/50 border-gray-700 text-white">
                    <SortAsc className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="created_at">Plus récents</SelectItem>
                    <SelectItem value="price_asc">Prix croissant</SelectItem>
                    <SelectItem value="price_desc">Prix décroissant</SelectItem>
                    <SelectItem value="popular">Plus populaires</SelectItem>
                    <SelectItem value="featured">Mis en avant</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex bg-gray-900/50 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Aucun produit trouvé</p>
                  <p className="text-sm">Essayez de modifier vos filtres</p>
                </div>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className={`
                      group bg-black/40 backdrop-blur-lg border-gray-800 hover:border-blue-500/50 
                      transition-all duration-300 cursor-pointer overflow-hidden
                      ${viewMode === 'list' ? 'md:flex md:flex-row' : ''}
                    `}
                  >
                    {viewMode === 'grid' ? (
                      <CardContent className="p-6">
                        {/* Featured Badge */}
                        {product.is_featured && (
                          <div className="flex justify-between items-start mb-3">
                            <Badge className="bg-orange-500/20 text-orange-400 border-orange-400/30">
                              ⭐ Featured
                            </Badge>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-400">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                        )}

                        {/* Category & Game */}
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30">
                            {getCategoryIcon(product.category)} {product.category.toUpperCase()}
                          </Badge>
                        </div>

                        <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                          {product.title}
                        </h3>

                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="text-sm text-gray-400 mb-3">
                          🎮 {product.game_name}
                          {product.level && <span className="ml-2">• Niveau {product.level}</span>}
                          {product.rank && <span className="ml-2">• {product.rank}</span>}
                        </div>

                        {/* Condition & Location */}
                        <div className="flex items-center gap-2 mb-4">
                          <Badge className={getConditionColor(product.condition)}>
                            {getConditionLabel(product.condition)}
                          </Badge>
                          <Badge className="bg-gray-500/20 text-gray-400 border-gray-400/30">
                            {product.location === 'fr' ? '🇫🇷 France' : '🌍 International'}
                          </Badge>
                        </div>

                        {/* Price & Stats */}
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
                            <div className="flex items-center gap-2">
                              <Eye className="w-3 h-3" />
                              {product.view_count}
                            </div>
                          </div>
                        </div>

                        <Button 
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                          size="sm"
                        >
                          Voir l'offre
                        </Button>
                      </CardContent>
                    ) : (
                      /* List View */
                      <>
                        <div className="md:w-1/3 p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30">
                              {getCategoryIcon(product.category)} {product.category.toUpperCase()}
                            </Badge>
                            {product.is_featured && (
                              <Badge className="bg-orange-500/20 text-orange-400 border-orange-400/30">
                                ⭐ Featured
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                            {product.title}
                          </h3>
                          
                          <div className="text-sm text-gray-400">
                            🎮 {product.game_name}
                          </div>
                        </div>

                        <div className="md:w-1/3 p-6 pt-6 md:pt-6">
                          <p className="text-sm text-gray-400 mb-3 line-clamp-3">
                            {product.description}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getConditionColor(product.condition)}>
                              {getConditionLabel(product.condition)}
                            </Badge>
                            <Badge className="bg-gray-500/20 text-gray-400 border-gray-400/30">
                              {product.location === 'fr' ? '🇫🇷' : '🌍'}
                            </Badge>
                          </div>
                        </div>

                        <div className="md:w-1/3 p-6 pt-6 md:pt-6">
                          <div className="text-right">
                            <div className="text-xl font-bold text-white mb-1">
                              {formatPrice(product.price)}
                            </div>
                            {product.original_price && (
                              <div className="text-sm text-gray-400 line-through mb-2">
                                {formatPrice(product.original_price)}
                              </div>
                            )}
                            
                            <div className="text-xs text-gray-400 mb-3 flex items-center justify-end gap-2">
                              <Eye className="w-3 h-3" />
                              {product.view_count} vues
                            </div>
                            
                            <Button 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                              size="sm"
                            >
                              Voir l'offre
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {/* Load More */}
            {products.length > 0 && (
              <div className="text-center mt-12">
                <Button
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800 px-8"
                  onClick={() => {/* TODO: Implement pagination */}}
                >
                  Charger plus de produits
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;