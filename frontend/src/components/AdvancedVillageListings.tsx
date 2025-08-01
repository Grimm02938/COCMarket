import { useState } from "react";
import { Star, Shield, ShieldX, Clock, Filter, Search, SlidersHorizontal, ArrowUpDown, ArrowLeft, Sword, Crown, Zap, Gamepad } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";

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

const serverFilters = [
  { label: "France", value: "france", icon: "🇫🇷" },
  { label: "International", value: "other", icon: "🌍" },
];

const sortOptions = [
  { label: "Plus récents", value: "newest" },
  { label: "Prix croissant", value: "price-asc" },
  { label: "Prix décroissant", value: "price-desc" },
  { label: "Mieux notés", value: "rating" },
];

const gameOptions = [
  { 
    label: "Clash of Clans", 
    value: "coc", 
    color: "from-orange-500 to-yellow-500",
    icon: Sword,
    image: "/api/placeholder/24/24" // Placeholder pour image PNG
  },
  { 
    label: "Clash Royale", 
    value: "cr", 
    color: "from-blue-500 to-purple-500",
    icon: Crown,
    image: "/api/placeholder/24/24"
  },
  { 
    label: "Hay Day", 
    value: "hd", 
    color: "from-green-500 to-blue-500",
    icon: Zap,
    image: "/api/placeholder/24/24"
  },
  { 
    label: "Boom Beach", 
    value: "bb", 
    color: "from-cyan-500 to-blue-500",
    icon: Gamepad,
    image: "/api/placeholder/24/24"
  },
];

export const AdvancedVillageListings = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedServer, setSelectedServer] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState("newest");
  const [showGameSelection, setShowGameSelection] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleViewDetails = (villageId: number) => {
    navigate(`/village/${villageId}`);
  };

  const handleGameSelect = (gameValue: string) => {
    setSelectedGame(gameValue);
    setShowGameSelection(false);
    // Animation de transition
    setTimeout(() => {
      setShowAdvancedFilters(true);
    }, 300);
  };

  const handleBackToGames = () => {
    setShowAdvancedFilters(false);
    setTimeout(() => {
      setSelectedGame("");
      setShowGameSelection(true);
    }, 300);
  };

  const selectedGameData = gameOptions.find(g => g.value === selectedGame);

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-4">
          Villages Disponibles
        </h2>
        <p className="text-muted-foreground mb-6">
          Découvrez notre sélection de villages premium, vérifiés et livrés instantanément
        </p>

        {/* Sélection de jeu avec transition */}
        {showGameSelection && (
          <div className="glass-effect rounded-xl p-6 mb-6 card-3d animate-in slide-in-from-left duration-500">
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <Gamepad className="w-5 h-5 mr-2" />
              Choisissez votre jeu
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {gameOptions.map((game) => {
                const IconComponent = game.icon;
                return (
                  <button
                    key={game.value}
                    onClick={() => handleGameSelect(game.value)}
                    className={`p-4 rounded-lg border transition-all duration-300 text-left hover:scale-105 group bg-gradient-to-r ${game.color} border-transparent hover:shadow-neon`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      {/* Placeholder pour image PNG */}
                      <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold text-white">{game.label}</span>
                    </div>
                    <div className="text-white/80 text-sm">
                      Cliquer pour explorer →
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Filtres spécifiques au jeu sélectionné */}
        {!showGameSelection && selectedGameData && (
          <div className="animate-in slide-in-from-right duration-500">
            {/* Header avec bouton retour stylé */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleBackToGames}
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/15 hover:border-primary/60 transition-all duration-300 group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Retour aux jeux
                </Button>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                    <selectedGameData.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{selectedGameData.label}</h3>
                </div>
              </div>
            </div>

            {/* Filtres principaux pour le jeu sélectionné - SUPPRESSION DU 2ème FILTRE */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              
              {/* Filtre Prix avec curseur */}
              <div className="glass-effect rounded-xl p-4 card-3d">
                <label className="block text-sm font-semibold text-primary mb-3">
                  Prix: {priceRange[0]}€ - {priceRange[1]}€
                </label>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={200}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>0€</span>
                  <span>200€+</span>
                </div>
              </div>

              {/* Localisation avec icônes */}
              <div className="glass-effect rounded-xl p-4 card-3d">
                <label className="block text-sm font-semibold text-primary mb-3 flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Localisation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {serverFilters.map((server) => (
                    <button
                      key={server.value}
                      onClick={() => setSelectedServer(selectedServer === server.value ? "" : server.value)}
                      className={`p-3 rounded-lg text-center font-medium transition-all duration-300 ${
                        selectedServer === server.value
                          ? 'bg-primary text-white shadow-neon'
                          : 'bg-background/50 text-muted-foreground hover:bg-primary/20 hover:text-primary'
                      }`}
                    >
                      <div className="text-lg mb-1">{server.icon}</div>
                      <div className="text-xs">{server.label}</div>
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
                  className="w-full p-2.5 bg-background/60 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 text-sm transition-all duration-300"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filtre niveau HDV étendu */}
            <div className="glass-effect rounded-xl p-4 mb-6 card-3d">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-primary flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Tous les niveaux HDV
                </label>
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="text-xs text-primary hover:text-cyan-400 transition-colors flex items-center"
                >
                  <SlidersHorizontal className="w-3 h-3 mr-1" />
                  {showAdvancedFilters ? 'Masquer' : 'Voir tous'}
                </button>
              </div>
              
              <div className={`grid gap-2 transition-all duration-300 ${
                showAdvancedFilters ? 'grid-cols-4 md:grid-cols-8' : 'grid-cols-4 md:grid-cols-6'
              }`}>
                {(showAdvancedFilters ? levelFilters : levelFilters.slice(0, 6)).map((level) => (
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

            {/* Résumé des filtres actifs */}
            {(selectedLevel || selectedServer || priceRange[0] > 0 || priceRange[1] < 200) && (
              <div className="mb-6 p-4 glass-effect rounded-xl border border-primary/20">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">Filtres actifs:</span>
                  {selectedLevel && (
                    <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs">
                      HDV {selectedLevel}
                    </span>
                  )}
                  {selectedServer && (
                    <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs">
                      {serverFilters.find(s => s.value === selectedServer)?.label}
                    </span>
                  )}
                  {(priceRange[0] > 0 || priceRange[1] < 200) && (
                    <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs">
                      {priceRange[0]}€ - {priceRange[1]}€
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedLevel("");
                      setSelectedServer("");
                      setPriceRange([0, 200]);
                    }}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors ml-2"
                  >
                    Effacer tout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grille des villages */}
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
              
              {/* Badge protection */}
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

              {/* Rating moved to bottom-left */}
              <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-yellow-400">{village.rating}</span>
                <span className="text-muted-foreground">({village.reviews})</span>
              </div>

              {/* Serveur badge moved to bottom-right */}
              <div className="absolute bottom-3 right-3 bg-background/80 px-2 py-1 rounded-full text-xs font-medium">
                {serverFilters.find(s => s.value === village.server.toLowerCase())?.icon} {village.server}
              </div>

              {/* Effet de survol plus subtil */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                  {village.title}
                </h3>
                {/* Seller name next to stars - clickable */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{village.rating}</span>
                  <span>({village.reviews} avis)</span>
                  <span>•</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Navigate to seller profile when real seller IDs are available
                      console.log('Navigate to seller:', village.seller);
                    }}
                    className="text-primary hover:text-cyan-400 transition-colors duration-200 font-medium"
                  >
                    {village.seller}
                  </button>
                </div>
              </div>

              {/* Livraison */}
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
                  onClick={() => handleViewDetails(village.id)}
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
          className="border-primary/40 text-primary hover:bg-primary/15 hover:border-primary/60 transform hover:scale-105 transition-all duration-300 px-8"
        >
          Voir plus de villages
        </Button>
      </div>
    </div>
  );
};