import { useState, useEffect } from "react";
import { Shield, Lock, CreditCard, Mail, Clock, ShieldCheck, CheckCircle, User, Key, Settings } from "lucide-react";

export const ModernScenarios = () => {
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

      {/* Une seule page avec les 2 modes côte à côte */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        
        {/* Mode Protection Activée */}
        <div className="glass-effect rounded-3xl p-8 card-3d-enhanced hover:shadow-neon group border border-green-400/30">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-4 mx-auto floating">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-400 mb-2">
              Protection Activée
            </h3>
            <p className="text-muted-foreground">
              Transfert automatique sécurisé avec cryptage militaire
            </p>
          </div>

          {/* Étapes du processus */}
          <div className="space-y-4">
            {[
              { icon: Mail, title: "Email de destination", desc: "Vous entrez votre email" },
              { icon: Clock, title: "Attente", desc: "Patientez 2-5 minutes" },
              { icon: ShieldCheck, title: "Code validation", desc: "Code à 6 chiffres" },
              { icon: CheckCircle, title: "Transfert terminé", desc: "Automatiquement" }
            ].map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div key={idx} className="flex items-center space-x-4 glass-effect rounded-xl p-4 border border-green-400/20">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {idx + 1}
                  </div>
                  <StepIcon className="w-5 h-5 text-green-400" />
                  <div className="flex-1">
                    <h5 className="font-bold text-green-400 text-sm">{step.title}</h5>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mode Protection Désactivée */}
        <div className="glass-effect rounded-3xl p-8 card-3d-enhanced hover:shadow-neon group border border-blue-400/30">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 mx-auto floating">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-blue-400 mb-2">
              Protection Désactivée
            </h3>
            <p className="text-muted-foreground">
              Accès direct aux identifiants du compte
            </p>
          </div>

          {/* Étapes du processus */}
          <div className="space-y-4">
            {[
              { icon: User, title: "Réception immédiate", desc: "Email et mot de passe" },
              { icon: Key, title: "Connexion manuelle", desc: "Vous vous connectez" },
              { icon: Settings, title: "Personnalisation", desc: "Changez les paramètres" }
            ].map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div key={idx} className="flex items-center space-x-4 glass-effect rounded-xl p-4 border border-blue-400/20">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {idx + 1}
                  </div>
                  <StepIcon className="w-5 h-5 text-blue-400" />
                  <div className="flex-1">
                    <h5 className="font-bold text-blue-400 text-sm">{step.title}</h5>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
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