import { useState } from "react";
import { Star, Shield, ShieldX, Clock, Filter, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const villagesData = [
  {
    id: 1,
    title: "Village Premium HDV 17",
    price: "89.99",
    originalPrice: "120.00",
    rating: 4.9,
    reviews: 127,
    level: "HDV 17 - Maxé",
    seller: "ProGamer_FR",
    verified: true,
    protected: true,
    delivery: "Instantané",
    server: "France",
    tags: ["Premium", "Maxé", "Rare"],
    screenshot: "village_premium.jpg"
  },
  {
    id: 2,
    title: "Compte Starter HDV 12",
    price: "29.99",
    originalPrice: "45.00",
    rating: 4.8,
    reviews: 89,
    level: "HDV 12 - Développé",
    seller: "GameMaster",
    verified: true,
    protected: false,
    delivery: "Instantané",
    server: "Other",
    tags: ["Starter", "Populaire"],
    screenshot: "village_starter.jpg"
  },
  {
    id: 3,
    title: "Méga Village HDV 17 Maxé",
    price: "149.99",
    originalPrice: "200.00",
    rating: 5.0,
    reviews: 203,
    level: "HDV 17 - Maxé",
    seller: "EliteGamer",
    verified: true,
    protected: true,
    delivery: "Instantané",
    server: "France",
    tags: ["VIP", "Exclusif", "Maxé"],
    screenshot: "village_vip.jpg"
  },
];

const levelFilters = [
  { label: "HDV 17", value: "17" },
  { label: "HDV 16", value: "16" },
  { label: "HDV 15", value: "15" },
  { label: "HDV 14", value: "14" },
  { label: "HDV 13", value: "13" },
  { label: "HDV 12", value: "12" },
  { label: "HDV 11", value: "11" },
  { label: "HDV 10", value: "10" },
];

const priceFilters = [
  { label: "< 30€", value: "0-30" },
  { label: "30€ - 60€", value: "30-60" },
  { label: "60€ - 100€", value: "60-100" },
  { label: "100€ - 150€", value: "100-150" },
  { label: "> 150€", value: "150+" },
];

const serverFilters = [
  { label: "France", value: "france" },
  { label: "Other", value: "other" },
];

const sortOptions = [
  { label: "Plus récents", value: "newest" },
  { label: "Prix croissant", value: "price-asc" },
  { label: "Prix décroissant", value: "price-desc" },
  { label: "Mieux notés", value: "rating" },
];

export const AdvancedVillageListings = () => {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedServer, setSelectedServer] = useState("");
  const [sortBy, setSortBy] = useState("newest");
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

        {/* Filtres principaux - Style révolutionnaire */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Filtre Niveau HDV */}
          <div className="glass-effect rounded-xl p-4 card-3d">
            <label className="block text-sm font-semibold text-primary mb-3">Niveau HDV</label>
            <div className="grid grid-cols-2 gap-2">
              {levelFilters.slice(0, 4).map((level) => (
                <button
                  key={level.value}
                  onClick={() => setSelectedLevel(selectedLevel === level.value ? "" : level.value)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedLevel === level.value
                      ? 'bg-primary text-white shadow-neon'
                      : 'bg-background/50 text-muted-foreground hover:bg-primary/20 hover:text-primary'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="w-full mt-2 p-2 text-xs text-primary hover:text-cyan-400 transition-colors"
            >
              Voir plus...
            </button>
          </div>

          {/* Filtre Prix */}
          <div className="glass-effect rounded-xl p-4 card-3d">
            <label className="block text-sm font-semibold text-primary mb-3">Gamme de Prix</label>
            <div className="space-y-2">
              {priceFilters.slice(0, 3).map((price) => (
                <button
                  key={price.value}
                  onClick={() => setSelectedPrice(selectedPrice === price.value ? "" : price.value)}
                  className={`w-full p-2 rounded-lg text-sm font-medium transition-all duration-300 text-left ${
                    selectedPrice === price.value
                      ? 'bg-primary text-white shadow-neon'
                      : 'bg-background/50 text-muted-foreground hover:bg-primary/20 hover:text-primary'
                  }`}
                >
                  {price.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtre Serveur */}
          <div className="glass-effect rounded-xl p-4 card-3d">
            <label className="block text-sm font-semibold text-primary mb-3">Serveur</label>
            <div className="space-y-2">
              {serverFilters.map((server) => (
                <button
                  key={server.value}
                  onClick={() => setSelectedServer(selectedServer === server.value ? "" : server.value)}
                  className={`w-full p-2 rounded-lg text-sm font-medium transition-all duration-300 text-left ${
                    selectedServer === server.value
                      ? 'bg-primary text-white shadow-neon'
                      : 'bg-background/50 text-muted-foreground hover:bg-primary/20 hover:text-primary'
                  }`}
                >
                  {server.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trier par */}
          <div className="glass-effect rounded-xl p-4 card-3d">
            <label className="block text-sm font-semibold text-primary mb-3 flex items-center">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Trier par
            </label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtres avancés (si activé) */}
        {showAdvancedFilters && (
          <div className="glass-effect rounded-xl p-6 mb-6 card-3d border border-primary/20">
            <h3 className="text-lg font-semibold mb-4 text-primary">Tous les niveaux HDV</h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {levelFilters.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setSelectedLevel(selectedLevel === level.value ? "" : level.value)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedLevel === level.value
                      ? 'bg-primary text-white shadow-neon'
                      : 'bg-background/50 text-muted-foreground hover:bg-primary/20 hover:text-primary'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grille des villages - AMÉLIORÉE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {villagesData.map((village) => (
          <div
            key={village.id}
            className="glass-effect rounded-2xl overflow-hidden card-3d hover:shadow-neon transition-all duration-500 group cursor-pointer"
          >
            {/* Screenshot simulé du village */}
            <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-cyan-500/30 rounded-full flex items-center justify-center mb-3 floating">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{village.level}</p>
                </div>
              </div>
              
              {/* Badge prix */}
              <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                €{village.price}
              </div>
              
              {/* Badge protection - DISTINCTION AMÉLIORÉE */}
              <div className="absolute top-3 right-3">
                {village.protected ? (
                  <div className="bg-green-500/20 p-2 rounded-full border-2 border-green-400/50">
                    <Shield className="w-4 h-4 text-green-400" />
                  </div>
                ) : (
                  <div className="bg-red-500/20 p-2 rounded-full border-2 border-red-400/50">
                    <ShieldX className="w-4 h-4 text-red-400" />
                  </div>
                )}
              </div>

              {/* Serveur badge */}
              <div className="absolute bottom-3 left-3 bg-background/80 px-2 py-1 rounded-full text-xs font-medium">
                {village.server}
              </div>

              {/* Effet de survol */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Contenu - SIMPLIFIÉ */}
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

              {/* Livraison - SIMPLIFIÉ */}
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">Livraison {village.delivery}</span>
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
                  className="bg-primary hover:bg-primary/90 text-white font-medium transform hover:scale-105 transition-all duration-300"
                >
                  Voir Détails
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="text-center mt-8">
        <Button 
          variant="outline"
          className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transform hover:scale-105 transition-all duration-300"
        >
          Voir plus de villages
        </Button>
      </div>
    </div>
  );
};