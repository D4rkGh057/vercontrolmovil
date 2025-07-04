import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { api } from './api';
import { logger } from './logger';
import { STRIPE_CONFIG, PaymentSheetParams, CreatePaymentSheetRequest, PaymentResult } from '../constants/stripe';

class StripeService {
  /**
   * Inicializa y presenta el Payment Sheet de Stripe
   */
  async processPayment(
    amount: number,
    currency: string = 'usd',
    customerEmail?: string,
    description?: string
  ): Promise<PaymentResult> {
    try {
      logger.info('🔄 Iniciando proceso de pago con Stripe', {
        amount,
        currency,
        customerEmail,
        description
      });

      // 1. Crear el Payment Sheet en el backend
      const paymentSheetParams = await this.createPaymentSheet({
        amount,
        currency,
        customerEmail
      });

      // 2. Inicializar el Payment Sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'VetControl',
        customerId: paymentSheetParams.customer,
        customerEphemeralKeySecret: paymentSheetParams.ephemeralKey,
        paymentIntentClientSecret: paymentSheetParams.paymentIntent,
        defaultBillingDetails: {
          email: customerEmail,
        },
        appearance: {
          colors: {
            primary: '#005456', // Color teal de la app
            background: '#ffffff',
            componentBackground: '#f8f9fa',
            primaryText: '#1f2937',
            secondaryText: '#6b7280',
          },
          shapes: {
            borderRadius: 12,
          },
        },
        returnURL: 'vetcontrol://payment-return',
      });

      if (initError) {
        logger.error('❌ Error al inicializar Payment Sheet:', initError);
        return {
          success: false,
          error: `Error al inicializar el pago: ${initError.message}`
        };
      }

      // 3. Presentar el Payment Sheet al usuario
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code === 'Canceled') {
          logger.info('🚫 Usuario canceló el pago');
          return {
            success: false,
            error: 'Pago cancelado por el usuario'
          };
        }

        logger.error('❌ Error al presentar Payment Sheet:', presentError);
        return {
          success: false,
          error: `Error en el pago: ${presentError.message}`
        };
      }

      // 4. Pago exitoso
      logger.info('✅ Pago completado exitosamente');
      
      // Extraer el Payment Intent ID del client secret
      const paymentIntentId = paymentSheetParams.paymentIntent.split('_secret_')[0];
      
      return {
        success: true,
        paymentIntentId
      };

    } catch (error) {
      logger.error('❌ Error en processPayment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido en el pago'
      };
    }
  }

  /**
   * Crear Payment Sheet en el backend
   */
  private async createPaymentSheet(request: CreatePaymentSheetRequest): Promise<PaymentSheetParams> {
    try {
      logger.info('🔄 Creando Payment Sheet en el backend', request);

      const response = await api.post('/stripe/payment-sheet', request);
      
      if (!response.data) {
        throw new Error('Respuesta vacía del servidor');
      }

      const { paymentIntent, ephemeralKey, customer, publishableKey } = response.data;

      if (!paymentIntent || !ephemeralKey || !customer) {
        throw new Error('Datos incompletos del Payment Sheet');
      }

      logger.info('✅ Payment Sheet creado exitosamente');

      return {
        paymentIntent,
        ephemeralKey,
        customer,
        publishableKey: publishableKey ?? STRIPE_CONFIG.PUBLISHABLE_KEY
      };

    } catch (error) {
      logger.error('❌ Error al crear Payment Sheet:', error);
      
      if (error instanceof Error) {
        throw new Error(`Error al crear Payment Sheet: ${error.message}`);
      }
      
      throw new Error('Error desconocido al crear Payment Sheet');
    }
  }

  /**
   * Verificar el estado de un Payment Intent
   */
  async getPaymentStatus(paymentIntentId: string) {
    try {
      const response = await api.get(`/stripe/payment-intent/${paymentIntentId}`);
      return response.data;
    } catch (error) {
      logger.error('❌ Error al obtener estado del pago:', error);
      throw error;
    }
  }

  /**
   * Crear un customer en Stripe
   */
  async createCustomer(email: string, name?: string, phone?: string) {
    try {
      const response = await api.post('/stripe/create-customer', {
        email,
        name,
        phone
      });
      return response.data;
    } catch (error) {
      logger.error('❌ Error al crear customer:', error);
      throw error;
    }
  }

}

/**
 * Formatear monto para Stripe (centavos)
 */
export const formatAmountForStripe = (amount: number): number => {
  // Stripe maneja montos en centavos
  return Math.round(amount * 100);
};

/**
 * Formatear monto desde Stripe (dólares)
 */
export const formatAmountFromStripe = (amount: number): number => {
  // Convertir de centavos a dólares
  return amount / 100;
};

export const stripeService = new StripeService();
