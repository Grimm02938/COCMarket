import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

interface SimpleFiltersProps {
  onLevelChange?: (level: string) => void;
  onPriceChange?: (min: number, max: number) => void;
  onServerChange?: (server: string) => void;
}

export const SimpleFilters = ({ onLevelChange, onPriceChange, onServerChange }: SimpleFiltersProps) => {
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedServer, setSelectedServer] = useState("all");
  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const [isServerOpen, setIsServerOpen] = useState(false);

  const levelOptions = [
    { value: "all", label: "Tous les niveaux" },
    { value: "17", label: "HDV 17" },
    { value: "16", label: "HDV 16" },
    { value: "15", label: "HDV 15" },
    { value: "14", label: "HDV 14" },
    { value: "13", label: "HDV 13" },
    { value: "12", label: "HDV 12" },
    { value: "11", label: "HDV 11" },
    { value: "10", label: "HDV 10" },
    { value: "9", label: "HDV 9" },
    { value: "8", label: "HDV 8" },
  ];

  const serverOptions = [
    { value: "all", label: "Tous les serveurs" },
    { value: "france", label: "France" },
    { value: "other", label: "Other" },
  ];

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
    setIsLevelOpen(false);
    onLevelChange?.(level);
  };

  const handleServerSelect = (server: string) => {
    setSelectedServer(server);
    setIsServerOpen(false);
    onServerChange?.(server);
  };

  const handlePriceChange = (value: number) => {
    const newRange: [number, number] = [priceRange[0], value];
    setPriceRange(newRange);
    onPriceChange?.(newRange[0], newRange[1]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="glass-effect rounded-2xl p-8 card-3d border border-primary/20">
        {/* Titre */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gradient mb-2 flex items-center">
            <SlidersHorizontal className="w-6 h-6 mr-3 text-primary" />
            Filtres
          </h3>
          <p className="text-sm text-muted-foreground">Personnalisez votre recherche</p>
        </div>

        <div className="space-y-8">
          {/* Niveau d'Hôtel de Ville */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-4">
              Niveau d'Hôtel de Ville
            </label>
            <div className="relative">
              <button
                onClick={() => setIsLevelOpen(!isLevelOpen)}
                className="w-full glass-effect rounded-xl p-4 flex items-center justify-between text-left hover:border-primary/50 transition-all duration-300 border border-white/10"
              >
                <span className="text-white font-medium">
                  {levelOptions.find(opt => opt.value === selectedLevel)?.label}
                </span>
                <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-300 ${isLevelOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isLevelOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-effect rounded-xl border border-primary/20 overflow-hidden z-50 shadow-neon">
                  {levelOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleLevelSelect(option.value)}
                      className={`w-full p-4 text-left transition-all duration-300 hover:bg-primary/20 ${
                        selectedLevel === option.value ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-white'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Gamme de Prix */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-4">
              Gamme de Prix
            </label>
            <div className="space-y-4">
              {/* Slider personnalisé */}
              <div className="relative">
                <div className="h-2 bg-background/50 rounded-full border border-white/10">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-cyan-500 rounded-full transition-all duration-300"
                    style={{ width: `${(priceRange[1] / 200) * 100}%` }}
                  ></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(parseInt(e.target.value))}
                  className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
                />
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-primary rounded-full border-4 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300"
                  style={{ left: `calc(${(priceRange[1] / 200) * 100}% - 12px)` }}
                ></div>
              </div>
              
              {/* Valeurs */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">0€</span>
                <div className="bg-primary/20 px-4 py-2 rounded-lg border border-primary/30">
                  <span className="text-primary font-bold">{priceRange[1]}€</span>
                </div>
                <span className="text-muted-foreground font-medium">200€</span>
              </div>
            </div>
          </div>

          {/* Serveur */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-4">
              Serveur
            </label>
            <div className="relative">
              <button
                onClick={() => setIsServerOpen(!isServerOpen)}
                className="w-full glass-effect rounded-xl p-4 flex items-center justify-between text-left hover:border-primary/50 transition-all duration-300 border border-white/10"
              >
                <span className="text-white font-medium">
                  {serverOptions.find(opt => opt.value === selectedServer)?.label}
                </span>
                <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-300 ${isServerOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isServerOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-effect rounded-xl border border-primary/20 overflow-hidden z-50 shadow-neon">
                  {serverOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleServerSelect(option.value)}
                      className={`w-full p-4 text-left transition-all duration-300 hover:bg-primary/20 ${
                        selectedServer === option.value ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-white'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};