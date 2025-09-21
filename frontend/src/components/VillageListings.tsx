import { useState } from "react";
import { Star, Shield, Coins, Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js"; // ✅ Ajout Stripe

// ⚠️ Clé publique dans .env.local => NEXT_PUBLIC_STRIPE_PUBLIC_KEY
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "");

const villagesData = [
  {
    id: 1,
    title: "Village Premium Maxé",
    price: "€89.99",
    originalPrice: "€120.00",
    rating: 4.9,
    reviews: 127,
    coins: "2.5M",
    level: "Château Niveau 25",
    seller: "ProGamer_FR",
    verified: true,
    delivery: "Instantané",
    image: "/lovable-uploads/village1.jpg",
    tags: ["Premium", "Maxé", "Rare"]
  },
  {
    id: 2,
    title: "Compte Starter Complet",
    price: "€29.99",
    originalPrice: "€45.00",
    rating: 4.8,
    reviews: 89,
    coins: "500K",
    level: "Château Niveau 15",
    seller: "GameMaster",
    verified: true,
    delivery: "< 1h",
    image: "/lovable-uploads/village2.jpg",
    tags: ["Starter", "Populaire"]
  },
  {
    id: 3,
    title: "Méga Village VIP",
    price: "€149.99",
    originalPrice: "€200.00",
    rating: 5.0,
    reviews: 203,
    coins: "5M+",
    level: "Château Niveau 30",
    seller: "EliteGamer",
    verified: true,
    delivery: "Instantané",
    image: "/lovable-uploads/village3.jpg",
    tags: ["VIP", "Exclusif", "Maxé"]
  },
];

const filterOptions = [
  { label: "Tous", value: "all" },
  { label: "Premium", value: "premium" },
  { label: "Starter", value: "starter" },
  { label: "VIP", value: "vip" },
];

export const VillageListings = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // ✅ Nouvelle fonction pour lancer Stripe Checkout
  async function handleCheckout(village: any) {
    const stripe = await stripePromise;
    if (!stripe) return alert("Stripe n'a pas pu être chargé.");

    const response = await fetch("/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: village.title,
        price: village.price,
      }),
    });

    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-4">
          Villages Disponibles
        </h2>
        <p className="text-muted-foreground mb-6">
          Découvrez notre sélection de villages premium, vérifiés et livrés instantanément
        </p>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <Button
                key={filter.value}
                variant={activeFilter === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.value)}
                className={activeFilter === filter.value 
                  ? "bg-gradient-to-r from-primary to-cyan-500" 
                  : "border-white/20 hover:bg-white/10"
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="border-white/20 hover:bg-white/10"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {villagesData.map((village) => (
          <div
            key={village.id}
            className="glass-effect rounded-2xl p-6 card-3d hover:shadow-neon transition-all duration-500 group"
          >
            {/* Village Preview */}
            <div className="relative mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 aspect-video">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-cyan-500/30 rounded-full flex items-center justify-center mb-2">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">{village.level}</p>
                </div>
              </div>
              
              {/* Price Badge */}
              <div className="absolute top-3 left-3 bg-gradient-to-r from-primary to-cyan-500 px-2 py-1 rounded-full text-xs font-medium text-white">
                {village.price}
              </div>
              
              {/* Verified Badge */}
              {village.verified && (
                <div className="absolute top-3 right-3 bg-green-500/20 p-1.5 rounded-full">
                  <Shield className="w-3 h-3 text-green-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                  {village.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{village.rating}</span>
                  <span>({village.reviews} avis)</span>
                </div>
              </div>

              {/* Features */}
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
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Pricing */}
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gradient">{village.price}</span>
                {village.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {village.originalPrice}
                  </span>
                )}
              </div>

              {/* Action avec Stripe */}
              <Button 
                className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-white font-medium"
                onClick={() => handleCheckout(village)}
              >
                Acheter maintenant
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
