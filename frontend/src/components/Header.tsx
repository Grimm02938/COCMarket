
import { useState } from "react";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-background border border-primary/30 rounded-xl flex items-center justify-center group hover:border-primary/60 transition-all duration-300">
              <span className="text-primary font-black text-lg font-mono group-hover:text-cyan-400 transition-colors duration-300">CM</span>
            </div>
            <span className="text-xl font-black text-white font-mono tracking-wider">CocMarket</span>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un village..."
                className="w-full pl-10 pr-4 py-2 bg-background/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
              Vendre
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Panier
            </Button>
            <Button 
              variant="outline" 
              className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 font-medium"
              onClick={() => setIsLoginModalOpen(true)}
            >
              <User className="w-4 h-4 mr-2" />
              Connexion
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white font-medium border border-primary/30 hover:border-primary/50 transition-all duration-300">
              Inscription
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un village..."
                  className="w-full pl-10 pr-4 py-2 bg-background/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" className="justify-start">
                  Vendre
                </Button>
                <Button variant="ghost" className="justify-start">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Panier
                </Button>
                <Button variant="outline" className="justify-start border-white/20">
                  <User className="w-4 h-4 mr-2" />
                  Connexion
                </Button>
                <Button className="bg-gradient-to-r from-primary to-cyan-500">
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
