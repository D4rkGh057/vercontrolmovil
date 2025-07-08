// Configuración de Stripe
export const STRIPE_CONFIG = {
  // La publishable key se puede exponer en el frontend
  PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? 'pk_test_...',
  // URL base del backend
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? 'http://10.79.5.67:3000',
};

// Tipos para las respuestas de Stripe
export interface PaymentSheetParams {
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
  publishableKey: string;
}

export interface CreatePaymentSheetRequest {
  amount: number;
  currency: string;
  customerEmail?: string;
  customerId?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}
