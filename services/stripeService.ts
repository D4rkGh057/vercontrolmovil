import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { api } from './api';
import { logger } from './logger';
import { STRIPE_CONFIG, PaymentSheetParams, CreatePaymentSheetRequest, PaymentResult } from '../constants/stripe';

/**
 * Configuración de apariencia para el Payment Sheet
 */
const getPaymentSheetAppearance = () => ({
  colors: {
    primary: '#005456', // Color teal de la app
    background: '#ffffff', // Fondo blanco
    componentBackground: '#ffffff', // Fondo de componentes blanco
    componentBorder: '#d1d5db', // Borde gris
    componentDivider: '#e5e7eb', // Divisores grises
    primaryText: '#000000', // Texto principal negro
    secondaryText: '#374151', // Texto secundario gris oscuro
    componentText: '#000000', // Texto en componentes negro
    placeholderText: '#6b7280', // Placeholder gris medio
    icon: '#374151', // Iconos grises oscuros
    error: '#dc2626', // Errores rojos
  },
  shapes: {
    borderRadius: 12,
    borderWidth: 1,
  },
  primaryButton: {
    colors: {
      background: '#005456',
      text: '#ffffff',
      border: '#005456',
    },
    shapes: {
      borderRadius: 8,
      borderWidth: 0,
    },
  },
});

/**
 * Configuración de alto contraste para mejor visibilidad
 */
const getHighContrastAppearance = () => ({
  colors: {
    primary: '#000000', // Negro para máximo contraste
    background: '#ffffff', // Fondo blanco puro
    componentBackground: '#ffffff', // Fondo de componentes blanco puro
    componentBorder: '#000000', // Bordes negros
    componentDivider: '#000000', // Divisores negros
    primaryText: '#000000', // Texto principal negro
    secondaryText: '#000000', // Texto secundario negro
    componentText: '#000000', // Texto en componentes negro
    placeholderText: '#666666', // Placeholder gris oscuro
    icon: '#000000', // Iconos negros
    error: '#cc0000', // Errores rojo oscuro
  },
  shapes: {
    borderRadius: 8,
    borderWidth: 2, // Bordes más gruesos
  },
  primaryButton: {
    colors: {
      background: '#000000',
      text: '#ffffff',
      border: '#000000',
    },
    shapes: {
      borderRadius: 6,
      borderWidth: 2,
    },
  },
});

class StripeService {
  /**
   * Inicializa y presenta el Payment Sheet de Stripe
   */
  async processPayment(
    amount: number,
    currency: string = 'usd',
    customerEmail?: string,
    description?: string,
    useHighContrast: boolean = false
  ): Promise<PaymentResult> {
    try {
      logger.info('🔄 Iniciando proceso de pago con Stripe', {
        amount,
        currency,
        customerEmail,
        description,
        useHighContrast
      });

      // 1. Crear el Payment Sheet en el backend
      const paymentSheetParams = await this.createPaymentSheet({
        amount,
        currency,
        customerEmail
      });

      // 2. Inicializar el Payment Sheet con apariencia seleccionada
      const appearance = useHighContrast ? getHighContrastAppearance() : getPaymentSheetAppearance();
      
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'VetControl',
        customerId: paymentSheetParams.customer,
        customerEphemeralKeySecret: paymentSheetParams.ephemeralKey,
        paymentIntentClientSecret: paymentSheetParams.paymentIntent,
        defaultBillingDetails: {
          email: customerEmail,
        },
        appearance,
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
