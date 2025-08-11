
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Mail, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FuturisticHeader from '@/components/FuturisticHeader';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const productId = searchParams.get('product_id');

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <FuturisticHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-green-400 mb-4">
            Paiement Réussi !
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Votre commande a été traitée avec succès
          </p>
        </div>

        {product && (
          <Card className="bg-black/40 backdrop-blur-lg border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Download className="w-5 h-5 mr-2 text-blue-400" />
                Détails de votre achat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Produit</div>
                  <div className="text-white font-medium">{product.title}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Jeu</div>
                  <div className="text-white font-medium">{product.game_name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Prix</div>
                  <div className="text-white font-medium">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(product.price)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Statut</div>
                  <div className="text-green-400 font-medium">✓ Payé</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-black/40 backdrop-blur-lg border-gray-800 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-blue-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Prochaines étapes
                </h3>
                <div className="space-y-2 text-gray-300">
                  <p>✓ Votre paiement a été confirmé</p>
                  <p>✓ Un email de confirmation a été envoyé</p>
                  <p>✓ Vous recevrez les détails du compte sous peu</p>
                  <p>• Notre équipe vous contactera dans les 24h maximum</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <Button
            onClick={() => navigate('/products')}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux produits
          </Button>
          
          <p className="text-sm text-gray-400">
            Une question ? Contactez notre support à{' '}
            <a href="mailto:support@cocmarket.com" className="text-blue-400 hover:underline">
              support@cocmarket.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
