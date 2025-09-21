import React, { useState, useEffect } from 'react';
import { Filter, X, SlidersHorizontal, MapPin, Globe, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FilterOptions {
  category: string;
  game: string;
  location: string;
  priceRange: [number, number];
  condition: string;
  featuredOnly: boolean;
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ onFiltersChange, isOpen, onToggle }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    game: '',
    location: '',
    priceRange: [0, 1000],
    condition: '',
    featuredOnly: false
  });

  const [games, setGames] = useState<string[]>([]);
  const [categories, setCategories] = useState<Array<{ value: string; label: string }>>([]);

  // Fetch categories and games from API
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [categoriesRes, gamesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/categories`),
          fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/games`)
        ]);
        
        const categoriesData = await categoriesRes.json();
        const gamesData = await gamesRes.json();
        
        setCategories(categoriesData);
        setGames(gamesData.map((g: any) => g.name));
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilterData();
  }, []);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const updateFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      game: '',
      location: '',
      priceRange: [0, 1000],
      condition: '',
      featuredOnly: false
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.game) count++;
    if (filters.location) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.condition) count++;
    if (filters.featuredOnly) count++;
    return count;
  };

  const gameCategories = [
    { value: 'fortnite', label: 'Fortnite', theme: 'from-purple-500 to-blue-500' },
    { value: 'wow', label: 'World of Warcraft', theme: 'from-yellow-500 to-orange-500' },
    { value: 'csgo', label: 'CS:GO', theme: 'from-red-500 to-orange-500' },
    { value: 'lol', label: 'League of Legends', theme: 'from-blue-500 to-teal-500' },
    { value: 'valorant', label: 'Valorant', theme: 'from-red-400 to-pink-500' }
  ];

  return (
    <div className="w-full">
      {/* Mobile Filter Toggle */}
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <Button
          onClick={onToggle}
          variant="outline"
          className="bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filtres
          {getActiveFiltersCount() > 0 && (
            <Badge className="ml-2 bg-blue-500 text-white">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <Card className="bg-black/40 backdrop-blur-lg border-gray-800">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Filter className="w-5 h-5 mr-2 text-blue-400" />
                Filtres avancés
              </CardTitle>
              {getActiveFiltersCount() > 0 && (
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4 mr-1" />
                  Effacer
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            
            {/* Price Range Slider */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-300">
                Prix: {filters.priceRange[0]}€ - {filters.priceRange[1]}€
              </label>
              <div className="px-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                  max={1000}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>0€</span>
                <span>1000€+</span>
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Catégorie</label>
              <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Game Theme Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Jeu / Thème</label>
              <div className="grid grid-cols-1 gap-2">
                {gameCategories.map((game) => (
                  <button
                    key={game.value}
                    onClick={() => updateFilter('game', filters.game === game.label ? '' : game.label)}
                    className={`
                      relative p-3 rounded-lg border transition-all duration-200 text-left
                      ${filters.game === game.label 
                        ? 'border-blue-400 bg-gradient-to-r ' + game.theme + ' text-white shadow-lg' 
                        : 'border-gray-700 bg-gray-900/30 text-gray-300 hover:border-gray-600'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{game.label}</span>
                      {filters.game === game.label && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Custom Game Selection */}
              <Select value={filters.game} onValueChange={(value) => updateFilter('game', value)}>
                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                  <SelectValue placeholder="Autre jeu..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="">Tous les jeux</SelectItem>
                  {games.map((game) => (
                    <SelectItem key={game} value={game}>
                      {game}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Localisation</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateFilter('location', filters.location === 'fr' ? '' : 'fr')}
                  className={`
                    p-3 rounded-lg border transition-all duration-200 text-center font-medium flex items-center justify-center space-x-2
                    ${filters.location === 'fr' 
                      ? 'border-blue-400 bg-blue-500/20 text-blue-400' 
                      : 'border-gray-700 bg-gray-900/30 text-gray-300 hover:border-gray-600'
                    }
                  `}
                >
                  <Flag className="w-4 h-4" />
                  <span>France</span>
                </button>
                <button
                  onClick={() => updateFilter('location', filters.location === 'other' ? '' : 'other')}
                  className={`
                    p-3 rounded-lg border transition-all duration-200 text-center font-medium flex items-center justify-center space-x-2
                    ${filters.location === 'other' 
                      ? 'border-orange-400 bg-orange-500/20 text-orange-400' 
                      : 'border-gray-700 bg-gray-900/30 text-gray-300 hover:border-gray-600'
                    }
                  `}
                >
                  <Globe className="w-4 h-4" />
                  <span>International</span>
                </button>
              </div>
            </div>

            {/* Condition Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">État</label>
              <Select value={filters.condition} onValueChange={(value) => updateFilter('condition', value)}>
                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                  <SelectValue placeholder="Tous les états" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="">Tous les états</SelectItem>
                  <SelectItem value="new">Neuf</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Bon</SelectItem>
                  <SelectItem value="fair">Correct</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Featured Only */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={filters.featuredOnly}
                onCheckedChange={(checked) => updateFilter('featuredOnly', !!checked)}
                className="border-gray-600 data-[state=checked]:bg-blue-500"
              />
              <label
                htmlFor="featured"
                className="text-sm text-gray-300 cursor-pointer"
              >
                Produits vedettes uniquement
              </label>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedFilters;