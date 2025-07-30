import { Shield, Lock, CreditCard } from "lucide-react";

export const ModernScenarios = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gradient mb-4">
          2 Modes de Protection Avancés
        </h2>
        <p className="text-xl text-muted-foreground">
          Les 2 sont 100% sécurisés et garantis
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Scenario 1 */}
        <div className="glass-effect rounded-3xl p-8 card-3d hover:neon-glow transition-all duration-500 group">
          <div className="relative">
            {/* Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 floating">
              <Shield className="w-8 h-8 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold mb-4 text-green-400">
              Mode 1: Protection Active
            </h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Transfert automatique sécurisé via notre interface protégée avec cryptage end-to-end
            </p>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Cryptage militaire AES-256</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Transfert instantané</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Traçabilité complète</span>
              </div>
            </div>

            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>
        </div>

        {/* Scenario 2 */}
        <div className="glass-effect rounded-3xl p-8 card-3d hover:neon-glow transition-all duration-500 group">
          <div className="relative">
            {/* Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 floating">
              <Lock className="w-8 h-8 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold mb-4 text-blue-400">
              Mode 2: Protection Désactivée
            </h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Accès direct aux identifiants vérifiés avec système de validation multi-niveaux
            </p>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Identifiants authentifiés</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Validation en temps réel</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Support prioritaire</span>
              </div>
            </div>

            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Guarantee section */}
      <div className="mt-12 glass-effect rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <CreditCard className="w-6 h-6 text-yellow-400" />
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