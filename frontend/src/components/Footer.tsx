import { Gamepad2, Shield, Zap, Users, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="mt-16 border-t border-white/10 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        
        {/* Section principale du footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Gamepad2 className="h-8 w-8 text-primary floating" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl font-black text-white font-mono tracking-wider">CocMarket</span>
                <div className="text-xs text-primary/70 -mt-1">Gaming Marketplace</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La marketplace gaming de nouvelle génération. Achetez et vendez vos comptes et objets gaming en toute sécurité.
            </p>
            
            {/* Icônes 3D discrètes de confiance */}
            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center space-x-2 text-xs text-green-400">
                <Shield className="w-4 h-4 floating" />
                <span>Sécurisé</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-yellow-400">
                <Zap className="w-4 h-4 floating" />
                <span>Instantané</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-blue-400">
                <Users className="w-4 h-4 floating" />
                <span>Vérifié</span>
              </div>
            </div>
          </div>

          {/* Liens rapides */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <a href="/villages" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  Tous les villages
                </a>
              </li>
              <li>
                <a href="/vendre" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  Vendre un village
                </a>
              </li>
              <li>
                <a href="/guide" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  Guide d'achat
                </a>
              </li>
              <li>
                <a href="/securite" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  Sécurité
                </a>
              </li>
              <li>
                <a href="/remboursement" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  Politique de remboursement
                </a>
              </li>
            </ul>
          </div>

          {/* Support et légal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Support & Légal</h3>
            <ul className="space-y-2">
              <li>
                <a href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  Nous contacter
                </a>
              </li>
              <li>
                <a href="/cgu" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  CGU
                </a>
              </li>
              <li>
                <a href="/confidentialite" className="text-sm text-muted-foreforeground hover:text-primary transition-colors duration-300">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="/mentions-legales" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  Mentions légales
                </a>
              </li>
            </ul>
          </div>

          {/* Contact et réseaux */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Nous contacter</h3>
            
            {/* Informations de contact */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@cocmarket.fr</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Paris, France</span>
              </div>
            </div>

            {/* Réseaux sociaux avec effets 3D subtils */}
            <div className="pt-4">
              <p className="text-sm font-medium text-white mb-3">Suivez-nous</p>
              <div className="flex space-x-3">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-10 h-10 bg-background/50 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 card-3d"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-10 h-10 bg-background/50 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 card-3d"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-10 h-10 bg-background/50 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 card-3d"
                >
                  <Instagram className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur discret */}
        <div className="border-t border-white/5"></div>

        {/* Bas du footer */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2025 CocMarket. Tous droits réservés.
          </div>
          
          {/* Badges de sécurité */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-green-400">
              <Shield className="w-4 h-4" />
              <span>SSL Sécurisé</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Paiements sécurisés • Livraison instantanée
            </div>
          </div>
        </div>
      </div>

      {/* Effets de particules subtils en arrière-plan */}
      <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none overflow-hidden">
        <div className="absolute bottom-8 left-1/4 w-16 h-16 bg-primary/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-12 right-1/3 w-12 h-12 bg-cyan-500/5 rounded-full blur-xl animate-pulse"></div>
      </div>
    </footer>
  );
};