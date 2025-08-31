import React, { useState } from 'react';
import { User, Mail, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import FuturisticHeader from '@/components/FuturisticHeader';
// ...existing code...

const UserProfile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    display_name: user?.display_name || '',
    bio: user?.bio || '',
    location_display: user?.location_display || '',
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white">
        <FuturisticHeader />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-400">Vous devez être connecté pour voir cette page.</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setEditForm({
      username: user.username,
      email: user.email,
      display_name: user.display_name || '',
      bio: user.bio || '',
      location_display: user.location_display || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setError('');
    setIsLoading(true);

    try {
      await updateProfile(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      username: user.username,
      email: user.email,
      display_name: user.display_name || '',
      bio: user.bio || '',
      location_display: user.location_display || '',
    });
    setError('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <FuturisticHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">Mon Profil</h1>
            <div className="flex space-x-3">
              {!isEditing ? (
                <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleSave} 
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                  <Button 
                    onClick={handleCancel} 
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              )}
              <Button 
                onClick={logout} 
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-600/20"
              >
                Se déconnecter
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Info Card */}
            <Card className="bg-black/40 backdrop-blur-lg border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Avatar and Basic Info */}
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400">
                    <AvatarFallback className="text-white font-bold text-xl">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {user.display_name || user.username}
                    </h2>
                    <p className="text-gray-400">@{user.username}</p>
                    <div className="flex items-center mt-2">
                      {user.is_verified && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-400/30 mr-2">
                          ✓ Vérifié
                        </Badge>
                      )}
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">
                        Membre depuis {formatDate(user.member_since)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Nom d'utilisateur
                    </label>
                    {isEditing ? (
                      <Input
                        value={editForm.username}
                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    ) : (
                      <p className="text-white bg-gray-800/30 px-3 py-2 rounded-md">{user.username}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    ) : (
                      <p className="text-white bg-gray-800/30 px-3 py-2 rounded-md flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {user.email}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Nom d'affichage
                    </label>
                    {isEditing ? (
                      <Input
                        value={editForm.display_name}
                        onChange={(e) => setEditForm({...editForm, display_name: e.target.value})}
                        placeholder="Nom à afficher publiquement"
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    ) : (
                      <p className="text-white bg-gray-800/30 px-3 py-2 rounded-md">
                        {user.display_name || 'Non défini'}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Localisation
                    </label>
                    {isEditing ? (
                      <Input
                        value={editForm.location_display}
                        onChange={(e) => setEditForm({...editForm, location_display: e.target.value})}
                        placeholder="Paris, France"
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    ) : (
                      <p className="text-white bg-gray-800/30 px-3 py-2 rounded-md flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {user.location_display || 'Non défini'}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Biographie
                  </label>
                  {isEditing ? (
                    <Textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      placeholder="Parlez-nous de vous..."
                      rows={3}
                      className="bg-gray-800/50 border-gray-600 text-white resize-none"
                    />
                  ) : (
                    <p className="text-white bg-gray-800/30 px-3 py-2 rounded-md min-h-[80px]">
                      {user.bio || 'Aucune biographie définie'}
                    </p>
                  )}
                </div>

              </CardContent>
            </Card>

          </div>

          {/* Right Column - Stats and Trust Score */}
          <div className="space-y-6">
            
            {/* Trust Score supprimé */}

            {/* Stats Card */}
            <Card className="bg-black/40 backdrop-blur-lg border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-900/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">{user.total_sales}</div>
                    <div className="text-sm text-gray-400">Ventes</div>
                  </div>
                  <div className="bg-gray-900/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">{user.total_purchases}</div>
                    <div className="text-sm text-gray-400">Achats</div>
                  </div>
                </div>
                
                <div className="bg-gray-900/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{user.trust_score.toFixed(1)}</div>
                  <div className="text-sm text-gray-400">Score de Confiance</div>
                </div>

                {/* Badges */}
                {user.badges && user.badges.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-200 mb-2">Badges</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.badges.map((badge, index) => (
                        <Badge key={index} className="bg-purple-500/20 text-purple-400 border-purple-400/30">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-center pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-center text-sm text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    Membre depuis le {formatDate(user.member_since)}
                  </div>
                </div>

              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;