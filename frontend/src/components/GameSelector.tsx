import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Star, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GameData {
  id: string;
  name: string;
  image: string;
  gradient: string;
  characteristics: {
    title: string;
    options: Array<{
      name: string;
      description: string;
      price: string;
      level?: string;
      features: string[];
    }>;
  };
}

const gameData: GameData[] = [
  {
    id: 'clash-of-clans',
    name: 'Clash of Clans',
    image: 'https://images.unsplash.com/photo-1560890637-8ad70c011c43?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxjbGFzaCUyMG9mJTIwY2xhbnN8ZW58MHx8fGVufDA&ixlib=rb-4.1.0&q=85',
    gradient: 'from-orange-500 to-red-500',
    characteristics: {
      title: 'Niveau d\'Hôtel de Ville',
      options: [
        {
          name: 'HDV 11',
          description: 'Base solide avec bonnes défenses',
          price: '89€',
          level: '11',
          features: ['Défenses niveau max', '500K+ trophées', 'Ressources incluses']
        },
        {
          name: 'HDV 12',
          description: 'Base avancée avec dernières défenses',
          price: '149€',
          level: '12',
          features: ['Giga Tesla', '600K+ trophées', 'Équipements rares']
        },
        {
          name: 'HDV 13',
          description: 'Base d\'élite complètement maxée',
          price: '249€',
          level: '13',
          features: ['Champion League', '700K+ trophées', 'Toutes défenses max']
        }
      ]
    }
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c5d8c3f1c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxmb3J0bml0ZXxlbnwwfHx8ZW58MA&ixlib=rb-4.1.0&q=85',
    gradient: 'from-purple-500 to-blue-500',
    characteristics: {
      title: 'Type de Compte',
      options: [
        {
          name: 'Compte Standard',
          description: 'Compte avec skins populaires',
          price: '45€',
          features: ['5-10 skins rares', 'V-Bucks inclus', 'Passe de combat']
        },
        {
          name: 'Compte Premium',
          description: 'Collection étendue de skins',
          price: '89€',  
          features: ['15-25 skins épiques', '2000+ V-Bucks', 'Emotes exclusives']
        },
        {
          name: 'Compte Elite',
          description: 'Collection complète avec skins OG',
          price: '199€',
          features: ['50+ skins légendaires', 'Skins OG rares', '5000+ V-Bucks']
        }
      ]
    }
  },
  {
    id: 'valorant',
    name: 'Valorant',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHx2YWxvcmFudHxlbnwwfHx8ZW58MA&ixlib=rb-4.1.0&q=85',
    gradient: 'from-red-500 to-pink-500',
    characteristics: {
      title: 'Rang Compétitif',
      options: [
        {
          name: 'Platine',
          description: 'Compte rang Platine avec skins',
          price: '65€',
          level: 'Platine II-III',
          features: ['Rang stable Platine', 'Skins d\'armes', 'Stats élevées']
        },
        {
          name: 'Diamant',
          description: 'Compte haut niveau Diamant',
          price: '125€',
          level: 'Diamant I-II',
          features: ['Top 5% joueurs', 'Collection skins', 'KDA excellent']
        },
        {
          name: 'Immortel',
          description: 'Compte élite niveau Immortel',
          price: '299€',
          level: 'Immortel',
          features: ['Top 1% mondial', 'Skins exclusifs', 'Stats légendaires']
        }
      ]
    }
  }
];

export const GameSelector = () => {
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleGameSelect = (game: GameData) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setSelectedGame(game);
      setIsTransitioning(false);
    }, 600);
  };

  const handleBack = () => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setSelectedGame(null);
      setIsTransitioning(false);
    }, 400);
  };

  if (selectedGame) {
    return (
      <div className={`transition-all duration-700 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        
        {/* Bouton retour stylé */}
        <div className="mb-8">
          <Button
            onClick={handleBack}
            variant="outline"
            className="bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600 transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Retour aux jeux
          </Button>
        </div>

        {/* En-tête du jeu sélectionné */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center space-x-3 bg-gradient-to-r ${selectedGame.gradient} p-1 rounded-2xl mb-6`}>
            <img
              src={selectedGame.image}
              alt={selectedGame.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div className="pr-6">
              <h2 className="text-2xl font-bold text-white">{selectedGame.name}</h2>
              <p className="text-white/80 text-sm">Sélectionnez votre {selectedGame.characteristics.title.toLowerCase()}</p>
            </div>
          </div>
          
          <h3 className="text-3xl font-bold text-white mb-2">{selectedGame.characteristics.title}</h3>
          <p className="text-gray-400">Choisissez le niveau qui vous convient</p>
        </div>

        {/* Options de caractéristiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedGame.characteristics.options.map((option, index) => (
            <Card
              key={index}
              className="group bg-black/40 backdrop-blur-lg border-gray-800 hover:border-blue-500/50 transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={`bg-gradient-to-r ${selectedGame.gradient} text-white border-none`}>
                    {option.level || 'Premium'}
                  </Badge>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{option.price}</div>
                  </div>
                </div>

                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {option.name}
                </h4>
                
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {option.description}
                </p>

                <div className="space-y-2 mb-6">
                  {option.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full bg-gradient-to-r ${selectedGame.gradient} hover:opacity-90 text-white font-semibold transition-all duration-300`}
                >
                  Acheter maintenant
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-700 ${isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
      
      {/* En-tête de sélection */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Choisissez votre Jeu
          </span>
        </h2>
        <p className="text-xl text-gray-400">Sélectionnez le jeu pour voir les comptes disponibles</p>
      </div>

      {/* Grille des jeux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gameData.map((game) => (
          <Card
            key={game.id}
            onClick={() => handleGameSelect(game)}
            className="group bg-black/40 backdrop-blur-lg border-gray-800 hover:border-blue-500/50 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl overflow-hidden"
          >
            {/* Image du jeu */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={game.image}
                alt={game.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${game.gradient} opacity-60 group-hover:opacity-70 transition-opacity duration-300`}></div>
              <div className="absolute inset-0 bg-black/20"></div>
              
              {/* Icône hover */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <ChevronRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                    {game.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Comptes & objets disponibles
                  </p>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-400">4.9</span>
                </div>
              </div>

              {/* Indicateurs de disponibilité */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-3 h-3" />
                    <span>High Level</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3" />
                    <span>Instant</span>
                  </div>
                </div>
                
                <Badge className="bg-green-500/20 text-green-400 border-green-400/30 text-xs">
                  En stock
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};