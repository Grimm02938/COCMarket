
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export interface PaymentData {
  product_id: string;
  success_url: string;
  cancel_url: string;
}

export const createCheckoutSession = async (paymentData: PaymentData) => {
  try {
    console.log('Creating checkout session with data:', paymentData);
    console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);
    
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error:', errorText);
      throw new Error(`Erreur serveur: ${response.status} - ${errorText}`);
    }

    const session = await response.json();
    console.log('Session created:', session);
    return session;
  } catch (error) {
    console.error('Erreur Stripe:', error);
    throw error;
  }
};

export const redirectToCheckout = async (sessionId: string) => {
  console.log('Redirecting to checkout with session ID:', sessionId);
  console.log('Stripe publishable key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'Present' : 'Missing');
  
  const stripe = await stripePromise;
  
  if (!stripe) {
    console.error('Stripe failed to load');
    throw new Error('Stripe n\'a pas pu être chargé. Vérifiez votre clé publique Stripe.');
  }

  console.log('Stripe loaded successfully, redirecting...');
  const { error } = await stripe.redirectToCheckout({
    sessionId: sessionId,
  });

  if (error) {
    console.error('Erreur de redirection Stripe:', error);
    throw error;
  }
};
