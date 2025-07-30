import { useState, useEffect } from "react";
import { Shield, Lock, CreditCard } from "lucide-react";

export const ModernScenarios = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 2);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const scenarios = [
    {
      title: "Protection Activée",
      description: "Transfert automatique sécurisé avec cryptage militaire. Le compte est transféré directement dans votre jeu sans partage d'identifiants.",
      color: "from-green-500 to-emerald-600",
      textColor: "text-green-400",
      icon: Shield,
      features: [
        "Transfert direct automatique",
        "Aucun identifiant partagé", 
        "Livraison instantanée"
      ],
      demo: {
        title: "Processus 100% automatisé",
        steps: [
          "Email de destination",
          "Attente (2-5 min)", 
          "Code de validation",
          "Transfert terminé"
        ]
      }
    },
    {
      title: "Protection Désactivée", 
      description: "Accès direct aux identifiants du compte. Vous recevez l'email et mot de passe pour vous connecter manuellement.",
      color: "from-blue-500 to-cyan-600",
      textColor: "text-blue-400",
      icon: Lock,
      features: [
        "Identifiants complets fournis",
        "Connexion manuelle requise",
        "Livraison instantanée"
      ],
      demo: {
        title: "Accès direct immédiat",
        steps: [
          "Réception des identifiants",
          "Connexion manuelle",
          "Compte à vous"
        ]
      }
    }
  ];

  return (
    <div id="protection-modes" className="w-full max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gradient mb-4">
          2 Modes de Protection Avancés
        </h2>
        <p className="text-xl text-muted-foreground">
          Les 2 sont 100% sécurisés et garantis
        </p>
      </div>

      {/* Carousel 3D détaillé */}
      <div className="perspective-1000 mb-12">
        <div className="relative h-96 overflow-hidden">
          {scenarios.map((scenario, index) => {
            const IconComponent = scenario.icon;
            const isActive = index === currentSlide;
            
            return (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 transform-gpu ${
                  isActive 
                    ? 'translate-x-0 opacity-100 scale-100' 
                    : index < currentSlide 
                      ? '-translate-x-full opacity-0 scale-95'
                      : 'translate-x-full opacity-0 scale-95'
                }`}
                style={{
                  transform: `
                    translateX(${isActive ? '0%' : index < currentSlide ? '-100%' : '100%'}) 
                    perspective(1000px) 
                    rotateY(${isActive ? '0deg' : index < currentSlide ? '-15deg' : '15deg'})
                    scale(${isActive ? '1' : '0.9'})
                  `,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="grid lg:grid-cols-2 gap-8 h-full">
                  {/* Content principal */}
                  <div className="glass-effect rounded-3xl p-8 card-3d-enhanced hover:shadow-neon group">
                    <div className="relative h-full flex flex-col">
                      <div className={`w-16 h-16 bg-gradient-to-br ${scenario.color} rounded-2xl flex items-center justify-center mb-6 floating`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      <h3 className={`text-2xl font-bold mb-4 ${scenario.textColor}`}>
                        {scenario.title}
                      </h3>
                      
                      <p className="text-lg text-muted-foreground mb-6 leading-relaxed flex-grow">
                        {scenario.description}
                      </p>

                      <div className="space-y-3">
                        {scenario.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-3">
                            <div className={`w-2 h-2 ${scenario.textColor.replace('text-', 'bg-')} rounded-full animate-pulse`}></div>
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Démo 3D interactive */}
                  <div className="glass-effect rounded-3xl p-8 card-3d-enhanced group">
                    <div className="relative h-full">
                      <h4 className="text-lg font-semibold mb-6 text-center">{scenario.demo.title}</h4>
                      
                      {/* Interface simulée */}
                      <div className="space-y-4 h-full flex flex-col justify-center">
                        {scenario.demo.steps.map((step, idx) => (
                          <div 
                            key={idx} 
                            className="glass-effect rounded-xl p-4 transform-gpu hover:scale-105 transition-all duration-300"
                            style={{
                              animationDelay: `${idx * 0.2}s`,
                              transform: `perspective(500px) rotateX(${isActive ? '0deg' : '10deg'})`
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 bg-gradient-to-br ${scenario.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                                {idx + 1}
                              </div>
                              <span className="text-sm">{step}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Effet 3D de profondeur */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-center mt-8 space-x-4">
          {scenarios.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-primary text-white shadow-neon'
                  : 'bg-white/10 text-muted-foreground hover:bg-white/20'
              }`}
            >
              Mode {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Garantie section */}
      <div className="glass-effect rounded-2xl p-6 text-center card-3d hover:shadow-neon transition-all duration-500">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <CreditCard className="w-6 h-6 text-yellow-400 animate-pulse" />
          <span className="text-xl font-bold text-yellow-400">
            Garantie Remboursement
          </span>
        </div>
        <p className="text-muted-foreground">
          L'argent n'est remis au vendeur qu'après confirmation de réception par l'acheteur
        </p>
      </div>
    </div>
  );
};