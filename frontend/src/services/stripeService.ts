
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export interface PaymentData {
  product_id: string;
  success_url: string;
  cancel_url: string;
}

export const createCheckoutSession = async (paymentData: PaymentData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création de la session de paiement');
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Erreur Stripe:', error);
    throw error;
  }
};

export const redirectToCheckout = async (sessionId: string) => {
  const stripe = await stripePromise;
  
  if (!stripe) {
    throw new Error('Stripe n\'a pas pu être chargé');
  }

  const { error } = await stripe.redirectToCheckout({
    sessionId: sessionId,
  });

  if (error) {
    console.error('Erreur de redirection Stripe:', error);
    throw error;
  }
};
