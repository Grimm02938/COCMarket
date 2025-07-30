import { Mail, Clock, ShieldCheck, CheckCircle } from "lucide-react";

export const ProcessSteps = () => {
  const steps = [
    {
      number: 1,
      title: "Email de destination",
      description: "Vous entrez votre email de destination",
      icon: Mail,
      color: "from-green-400 to-emerald-500"
    },
    {
      number: 2,
      title: "Attente",
      description: "Patientez quelques minutes (2-5 min)",
      icon: Clock,
      color: "from-green-400 to-emerald-500"
    },
    {
      number: 3,
      title: "Code de validation",
      description: "Entrez le code à 6 chiffres reçu par mail",
      icon: ShieldCheck,
      color: "from-green-400 to-emerald-500"
    },
    {
      number: 4,
      title: "Transfert terminé",
      description: "Le compte est transféré automatiquement",
      icon: CheckCircle,
      color: "from-green-400 to-emerald-500"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-8 mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-green-400 mb-4">
          Étapes du processus :
        </h2>
      </div>

      {/* Grille des étapes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          
          return (
            <div
              key={step.number}
              className="relative glass-effect rounded-2xl p-6 border-2 border-green-400/30 hover:border-green-400/60 transition-all duration-500 card-3d group"
            >
              {/* Numéro de l'étape */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {step.number}
                </div>
              </div>

              {/* Contenu */}
              <div className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-2xl flex items-center justify-center floating">
                  <IconComponent className="w-8 h-8 text-green-400" />
                </div>
                
                <h3 className="text-lg font-bold text-green-400">
                  {step.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Effet de survol */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      {/* Section processus automatisé */}
      <div className="glass-effect rounded-2xl p-8 text-center border-2 border-green-400/30 card-3d">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-6 h-6 bg-green-400 rounded-sm flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-400">
            Processus 100% Automatisé
          </h3>
        </div>
        
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Notre système s'occupe de tout. Vous n'avez qu'à suivre les étapes et votre compte sera transféré en toute sécurité.
        </p>
      </div>
    </div>
  );
};