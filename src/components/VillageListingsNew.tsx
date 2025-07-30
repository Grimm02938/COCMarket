import { useState } from "react";
import { Star, Shield, Coins, Clock, Filter, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const villagesData = [
  {
    id: 1,
    title: "Village Premium Maxé",
    price: "89.99",
    originalPrice: "120.00",
    rating: 4.9,
    reviews: 127,
    coins: "2.5M",
    level: "Château Niveau 25",
    seller: "ProGamer_FR",
    verified: true,
    delivery: "Instantané",
    tags: ["Premium", "Maxé", "Rare"],
    screenshot: "village_premium.jpg"
  },
  {
    id: 2,
    title: "Compte Starter Complet",
    price: "29.99",
    originalPrice: "45.00",
    rating: 4.8,
    reviews: 89,
    coins: "500K",
    level: "Château Niveau 15",
    seller: "GameMaster",
    verified: true,
    delivery: "< 1h",
    tags: ["Starter", "Populaire"],
    screenshot: "village_starter.jpg"
  },
  {
    id: 3,
    title: "Méga Village VIP",
    price: "149.99",
    originalPrice: "200.00",
    rating: 5.0,
    reviews: 203,
    coins: "5M+",
    level: "Château Niveau 30",
    seller: "EliteGamer",
    verified: true,
    delivery: "Instantané",
    tags: ["VIP", "Exclusif", "Maxé"],
    screenshot: "village_vip.jpg"
  },
];

const filterCategories = [
  { label: "Tous", value: "all" },
  { label: "Premium", value: "premium" },
  { label: "Starter", value: "starter" },
  { label: "VIP", value: "vip" },
];

const priceRanges = [
  { label: "Tous les prix", value: "all" },
  { label: "< 50€", value: "0-50" },
  { label: "50€ - 100€", value: "50-100" },
  { label: "> 100€", value: "100+" },
];

const sortOptions = [
  { label: "Plus récents", value: "newest" },
  { label: "Prix croissant", value: "price-asc" },
  { label: "Prix décroissant", value: "price-desc" },
  { label: "Mieux notés", value: "rating" },
];

export const VillageListingsNew = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-4">
          Villages Disponibles
        </h2>
        <p className="text-muted-foreground mb-6">
          Découvrez notre sélection de villages premium, vérifiés et livrés instantanément
        </p>

        {/* Barre de recherche principale */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un village, un niveau, un prix..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-background/50 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-sm glass-effect"
          />
        </div>

        {/* Filtres rapides */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {filterCategories.map((filter) => (
              <Button
                key={filter.value}
                variant={activeFilter === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.value)}
                className={activeFilter === filter.value 
                  ? "bg-primary hover:bg-primary/90 text-white" 
                  : "border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filtres avancés
          </Button>
        </div>

        {/* Filtres avancés */}
        {showAdvancedFilters && (
          <div className="glass-effect rounded-xl p-6 mb-6 card-3d">
            <h3 className="text-lg font-semibold mb-4">Filtres avancés</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Prix */}
              <div>
                <label className="block text-sm font-medium mb-2">Prix</label>
                <select 
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full p-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Tri */}
              <div>
                <label className="block text-sm font-medium mb-2">Trier par</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Niveau minimum */}
              <div>
                <label className="block text-sm font-medium mb-2">Niveau château min.</label>
                <input 
                  type="number"
                  placeholder="Ex: 20"
                  className="w-full p-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grille des villages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {villagesData.map((village) => (
          <div
            key={village.id}
            className="glass-effect rounded-2xl overflow-hidden card-3d hover:shadow-neon transition-all duration-500 group"
          >
            {/* Screenshot simulé du village */}
            <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-cyan-500/30 rounded-full flex items-center justify-center mb-3 floating">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{village.level}</p>
                  <p className="text-xs text-primary">{village.coins} pièces</p>
                </div>
              </div>
              
              {/* Badge prix */}
              <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                €{village.price}
              </div>
              
              {/* Badge vérifié */}
              {village.verified && (
                <div className="absolute top-3 right-3 bg-green-500/20 p-2 rounded-full">
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
              )}

              {/* Effet de survol */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                  {village.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{village.rating}</span>
                  <span>({village.reviews} avis)</span>
                </div>
              </div>

              {/* Caractéristiques */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-muted-foreground">{village.coins} pièces</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-muted-foreground">Livraison {village.delivery}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {village.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Prix et action */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-white">€{village.price}</span>
                  {village.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      €{village.originalPrice}
                    </span>
                  )}
                </div>
                <Button 
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white font-medium"
                >
                  Acheter
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination ou load more */}
      <div className="text-center mt-8">
        <Button 
          variant="outline"
          className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
        >
          Voir plus de villages
        </Button>
      </div>
    </div>
  );
};