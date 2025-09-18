import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Package, MessageSquare, Star, Plus, History } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SellerProfile } from './SellerProfile';

interface Review {
  id: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewerUsername: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Sale {
  id: string;
  productName: string;
  price: number;
  buyerName: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showNewListingForm, setShowNewListingForm] = useState(false);

  // Simulated data - replace with real API calls
  const userReviews: Review[] = [];
  const messages: Message[] = [];
  const salesHistory: Sale[] = [];

  const handleNewListing = () => {
    setShowNewListingForm(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="mb-8">
          {user && <SellerProfile sellerId={user.id} />}
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex items-center justify-between">
            <TabsList className="bg-slate-800/50 p-1 rounded-xl">
              <TabsTrigger value="profile" className="data-[state=active]:bg-blue-600">
                Profile
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-blue-600">
                Avis
              </TabsTrigger>
              <TabsTrigger value="messages" className="data-[state=active]:bg-blue-600">
                Messages
              </TabsTrigger>
              <TabsTrigger value="sales" className="data-[state=active]:bg-blue-600">
                Ventes
              </TabsTrigger>
            </TabsList>

            <Button
              onClick={handleNewListing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle Annonce
            </Button>
          </div>

          {/* Profile Content */}
          <TabsContent value="profile" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-semibold text-white mb-4">Statistiques</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Ventes totales</span>
                    <span className="text-white font-medium">{user?.total_sales || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Note moyenne</span>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                      <span className="text-white font-medium">{user?.trust_score || 5.0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Membre depuis</span>
                    <span className="text-white font-medium">
                      {new Date(user?.member_since || '').toLocaleDateString('fr-FR', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-semibold text-white mb-4">Actions Rapides</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline"
                    className="flex items-center justify-center space-x-2 h-20 border-slate-600 hover:border-blue-500"
                  >
                    <Package className="w-6 h-6" />
                    <span>Gérer mes annonces</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center justify-center space-x-2 h-20 border-slate-600 hover:border-blue-500"
                  >
                    <MessageSquare className="w-6 h-6" />
                    <span>Messages ({messages.length})</span>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Reviews Content */}
          <TabsContent value="reviews" className="mt-6">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50">
              {userReviews.length > 0 ? (
                <div className="divide-y divide-slate-700/50">
                  {userReviews.map((review) => (
                    <div key={review.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-500'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-gray-300">par {review.reviewerUsername}</span>
                          </div>
                          <p className="mt-2 text-white">{review.comment}</p>
                        </div>
                        <span className="text-sm text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Star className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">Aucun avis pour le moment</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Messages Content */}
          <TabsContent value="messages" className="mt-6">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50">
              {messages.length > 0 ? (
                <div className="divide-y divide-slate-700/50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-6 ${!message.isRead ? 'bg-blue-900/10' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-white">
                              {message.senderName}
                            </span>
                            {!message.isRead && (
                              <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">
                                Nouveau
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-gray-300">{message.content}</p>
                        </div>
                        <span className="text-sm text-gray-400">
                          {new Date(message.timestamp).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">Aucun message</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Sales History Content */}
          <TabsContent value="sales" className="mt-6">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50">
              {salesHistory.length > 0 ? (
                <div className="divide-y divide-slate-700/50">
                  {salesHistory.map((sale) => (
                    <div key={sale.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-white">{sale.productName}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-gray-300">
                              Acheteur: {sale.buyerName}
                            </span>
                            <span className="text-blue-400 font-medium">
                              {sale.price.toLocaleString('fr-FR')} €
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-400">
                            {new Date(sale.date).toLocaleDateString('fr-FR')}
                          </span>
                          <div className="mt-1">
                            <span
                              className={`text-sm px-2 py-1 rounded-full ${
                                sale.status === 'completed'
                                  ? 'bg-green-500/20 text-green-400'
                                  : sale.status === 'pending'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {sale.status === 'completed'
                                ? 'Terminée'
                                : sale.status === 'pending'
                                ? 'En cours'
                                : 'Annulée'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <History className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">Aucune vente pour le moment</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};