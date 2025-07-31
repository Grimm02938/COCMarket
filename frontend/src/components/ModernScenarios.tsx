import { useState, useEffect } from "react";
import { Shield, Lock, CreditCard, Mail, Clock, ShieldCheck, CheckCircle, User, Key, Settings } from "lucide-react";

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
      steps: [
        {
          number: 1,
          title: "Email de destination",
          description: "Vous entrez votre email de destination",
          icon: Mail,
        },
        {
          number: 2,
          title: "Attente",
          description: "Patientez quelques minutes (2-5 min)",
          icon: Clock,
        },
        {
          number: 3,
          title: "Code de validation",
          description: "Entrez le code à 6 chiffres reçu par mail",
          icon: ShieldCheck,
        },
        {
          number: 4,
          title: "Transfert terminé",
          description: "Le compte est transféré automatiquement",
          icon: CheckCircle,
        }
      ]
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
      steps: [
        {
          number: 1,
          title: "Réception immédiate",
          description: "Vous recevez email et mot de passe",
          icon: User,
        },
        {
          number: 2,
          title: "Connexion manuelle",
          description: "Vous vous connectez avec les identifiants",
          icon: Key,
        },
        {
          number: 3,
          title: "Personnalisation",
          description: "Changez les paramètres selon vos préférences",
          icon: Settings,
        }
      ]
    }
  ];

  return (
    <div id="protection-modes" className="w-full max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gradient mb-4">
          2 Modes de Livraison
        </h2>
        <p className="text-xl text-muted-foreground">
          Choisissez votre méthode préférée - Les 2 sont 100% sécurisés
        </p>
      </div>

      {/* Carousel horizontal fluide - AMÉLIORATION COULISSEMENT */}
      <div className="relative mb-12 overflow-hidden rounded-3xl">
        <div className="relative h-[500px]">
          <div 
            className="flex transition-transform duration-1000 ease-in-out h-full"
            style={{ 
              transform: `translateX(-${currentSlide * 100}%)`,
              width: `${scenarios.length * 100}%`
            }}
          >
            {scenarios.map((scenario, index) => {
              const IconComponent = scenario.icon;
              
              return (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-4"
                  style={{ width: `${100 / scenarios.length}%` }}
                >
                  <div className="grid lg:grid-cols-2 gap-8 h-full">
                    {/* Content principal */}
                    <div className="glass-effect rounded-3xl p-8 card-3d-enhanced hover:shadow-neon group h-full">
                      <div className="relative h-full flex flex-col">
                        <div className={`w-16 h-16 bg-${scenario.color.includes('green') ? 'green-500' : 'blue-500'} rounded-2xl flex items-center justify-center mb-6 floating`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>

                        <h3 className={`text-2xl font-bold mb-4 ${scenario.textColor}`}>
                          {scenario.title}
                        </h3>
                        
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                          {scenario.description}
                        </p>

                        <div className="space-y-3 mb-6">
                          {scenario.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-3">
                              <div className={`w-2 h-2 ${scenario.textColor.replace('text-', 'bg-')} rounded-full`}></div>
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Étapes du processus intégrées */}
                    <div className="glass-effect rounded-3xl p-6 card-3d-enhanced group h-full">
                      <div className="relative h-full">
                        <h4 className={`text-lg font-semibold mb-6 text-center ${scenario.textColor}`}>
                          {scenario.title === "Protection Activée" ? "Processus 100% Automatisé" : "Processus Direct"}
                        </h4>
                        
                        {/* Grille des étapes */}
                        <div className="space-y-4">
                          {scenario.steps.map((step, idx) => {
                            const StepIcon = step.icon;
                            return (
                              <div 
                                key={idx} 
                                className="glass-effect rounded-xl p-4 transform-gpu hover:scale-105 transition-all duration-300 border border-white/10"
                              >
                                <div className="flex items-center space-x-4">
                                  {/* Numéro avec icône */}
                                  <div className="relative">
                                    <div className={`w-12 h-12 bg-${scenario.color.includes('green') ? 'green-500' : 'blue-500'} rounded-full flex items-center justify-center text-white font-bold`}>
                                      {step.number}
                                    </div>
                                    <div className={`absolute -top-1 -right-1 w-6 h-6 bg-${scenario.color.includes('green') ? 'green-400' : 'blue-400'}/20 rounded-full flex items-center justify-center`}>
                                      <StepIcon className={`w-3 h-3 ${scenario.textColor}`} />
                                    </div>
                                  </div>
                                  
                                  {/* Contenu */}
                                  <div className="flex-1">
                                    <h5 className={`font-bold ${scenario.textColor} mb-1`}>{step.title}</h5>
                                    <p className="text-xs text-muted-foreground">{step.description}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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