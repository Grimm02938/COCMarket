import React, { useState } from 'react';
import { X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { register, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    console.log('Apple Sign-in clicked');
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    setIsLoading(true);
    try {
      await register(username, email, password);
      onSuccess?.();
      onClose();
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      onSuccess?.();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setShowEmailForm(false);
    setShowLoginForm(false);
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-4 mt-20"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      <div 
        className="relative w-full max-w-md mx-auto bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-lg rounded-3xl border border-gray-700/50 shadow-2xl flex flex-col max-h-[80vh] animate-in fade-in-0 slide-in-from-top-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 border-b border-gray-700/50 flex-shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-white mb-2">Rejoignez CocMarket</h2>
          <p className="text-gray-300 text-sm">Choisissez votre méthode d'inscription</p>
        </div>
        <div className="p-6 overflow-y-auto flex-grow">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {!showEmailForm && !showLoginForm ? (
            <div className="space-y-4">
              <Button onClick={handleGoogleSignIn} disabled={isLoading} className="w-full bg-white hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-xl border border-gray-300 transition-all duration-300 flex items-center justify-center space-x-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                <span>Continuer avec Google</span>
              </Button>

              <Button onClick={handleAppleSignIn} disabled={true} className="w-full bg-gray-600 text-gray-400 font-medium py-3 px-4 rounded-xl border-2 border-gray-600 transition-all duration-300 flex items-center justify-center space-x-3 cursor-not-allowed">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>
                <span>Apple (bientôt disponible)</span>
              </Button>
              
              <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600"></div></div><div className="relative flex justify-center text-sm"><span className="px-4 bg-slate-800 text-gray-400">ou</span></div></div>

              <Button onClick={() => setShowEmailForm(true)} className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3">
                <Mail className="w-5 h-5" />
                <span>S'inscrire avec Email</span>
              </Button>

              <div className="text-center mt-6"><p className="text-gray-400 text-sm">Déjà membre ? <button onClick={() => setShowLoginForm(true)} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Se connecter</button></p></div>
            </div>
          ) : showEmailForm ? (
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-200 mb-2">Nom d'utilisateur</label><Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20" placeholder="MonPseudo"/></div>
              <div><label className="block text-sm font-medium text-gray-200 mb-2">Adresse email</label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20" placeholder="votre@email.com"/></div>
              <div><label className="block text-sm font-medium text-gray-200 mb-2">Mot de passe</label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20" placeholder="••••••••" autoComplete="new-password"/></div>
              <div><label className="block text-sm font-medium text-gray-200 mb-2">Confirmer le mot de passe</label><Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20" placeholder="••••••••" autoComplete="new-password"/></div>
              <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 mt-6">{isLoading ? 'Création en cours...' : 'Créer mon compte'}</Button>
              <Button type="button" onClick={resetForm} variant="ghost" className="w-full text-gray-400 hover:text-white transition-colors">← Retour aux options</Button>
            </form>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-200 mb-2">Adresse email</label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20" placeholder="votre@email.com"/></div>
              <div><label className="block text-sm font-medium text-gray-200 mb-2">Mot de passe</label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20" placeholder="••••••••" autoComplete="current-password"/></div>
              <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 mt-6">{isLoading ? 'Connexion...' : 'Se connecter'}</Button>
              <Button type="button" onClick={resetForm} variant="ghost" className="w-full text-gray-400 hover:text-white transition-colors">← Retour aux options</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
