
import { useState } from "react";
import { Search, User, ShoppingCart, Menu, X, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo amélioré avec espacement */}
          <div className="flex items-center space-x-4">
            {/* Logo futuriste que vous aimez */}
            <div className="relative">
              <Gamepad2 className="h-8 w-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
            
            {/* Logo original amélioré */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-background border border-primary/40 rounded-xl flex items-center justify-center group hover:border-primary/70 transition-all duration-300">
                <span className="text-primary font-black text-lg font-mono group-hover:text-cyan-400 transition-colors duration-300">CM</span>
              </div>
              <div>
                <span className="text-xl font-black text-white font-mono tracking-wider">CocMarket</span>
                <div className="text-xs text-primary/70 -mt-1">Gaming Marketplace</div>
              </div>
            </div>
          </div>

          {/* Search Bar - Desktop épuré */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un village..."
                className="w-full pl-10 pr-4 py-2.5 bg-background/60 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/40 text-sm transition-all duration-300"
              />
            </div>
          </div>

          {/* Navigation - Desktop simplifié */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium px-4">
              Vendre
            </Button>
            
            {/* Panier avec compteur */}
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium relative px-4"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Panier
              <Badge className="absolute -top-1 -right-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center">
                0
              </Badge>
            </Button>
            
            {/* Compte utilisateur plus visible */}
            <Button 
              variant="outline" 
              className="border-primary/40 text-primary hover:bg-primary/15 hover:border-primary/60 transition-all duration-300 font-medium px-4"
              onClick={() => setIsLoginModalOpen(true)}
            >
              <User className="w-4 h-4 mr-2" />
              Mon Compte
            </Button>
            
            <Button className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-white font-medium border border-primary/30 hover:border-primary/50 transition-all duration-300 px-4">
              Inscription
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu amélioré */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="space-y-4">
              {/* Search mobile */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un village..."
                  className="w-full pl-10 pr-4 py-2.5 bg-background/60 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/60 text-sm"
                />
              </div>
              
              {/* Navigation mobile plus claire */}
              <div className="flex flex-col space-y-3 pt-2">
                <Button variant="ghost" className="justify-start text-left px-4">
                  Vendre
                </Button>
                <Button variant="ghost" className="justify-start text-left px-4 relative">
                  <ShoppingCart className="w-4 h-4 mr-3" />
                  Panier
                  <Badge className="ml-auto bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                    0
                  </Badge>
                </Button>
                <Button variant="outline" className="justify-start text-left border-white/20 px-4">
                  <User className="w-4 h-4 mr-3" />
                  Mon Compte
                </Button>
                <Button className="bg-gradient-to-r from-primary to-cyan-500 text-white font-medium">
                  Inscription
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
