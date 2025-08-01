import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SellerProfile } from '@/components/SellerProfile';
import { Header } from '@/components/Header';

const SellerProfilePage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();

  if (!sellerId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-400">Vendeur non trouvé</p>
            <Button 
              onClick={() => navigate('/')}
              className="mt-4"
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Navigation back button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="border-primary/40 text-primary hover:bg-primary/15 hover:border-primary/60 transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour à l'accueil
          </Button>
        </div>

        {/* Seller Profile Component */}
        <SellerProfile sellerId={sellerId} />
      </div>
    </div>
  );
};

export default SellerProfilePage;