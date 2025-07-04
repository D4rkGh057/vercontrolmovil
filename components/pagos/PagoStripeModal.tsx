import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { CreditCard, X, CheckCircle, AlertCircle } from 'lucide-react-native';
import { Pago } from '../../types';
import { stripeService, formatAmountForStripe } from '../../services/stripeService';
import { logger } from '../../services/logger';

interface PagoStripeModalProps {
  visible: boolean;
  pago: Pago | null;
  onClose: () => void;
  onPaymentSuccess: (paymentIntentId: string) => void;
}

export const PagoStripeModal: React.FC<PagoStripeModalProps> = ({
  visible,
  pago,
  onClose,
  onPaymentSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [useHighContrast, setUseHighContrast] = useState(false);

  if (!pago) return null;

  const monto = pago.monto ?? pago.total ?? 0;
  const descripcion = pago.concepto ?? pago.descripcion ?? 'Pago VetControl';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(amount) || 0);
  };

  const handlePayWithStripe = async () => {
    try {
      setLoading(true);
      logger.info('🔄 Iniciando pago con Stripe', { pagoId: pago.id_pago ?? pago.id_factura, monto });

      // Convertir el monto a centavos para Stripe
      const amountInCents = formatAmountForStripe(monto);
      
      // Obtener email del usuario (puedes ajustar esto según tu store de auth)
      const customerEmail = pago.id_usuario?.email ?? 'cliente@vetcontrol.com';

      const result = await stripeService.processPayment(
        amountInCents,
        'usd',
        customerEmail,
        descripcion,
        useHighContrast
      );

      if (result.success && result.paymentIntentId) {
        logger.info('✅ Pago completado exitosamente', { paymentIntentId: result.paymentIntentId });
        
        Alert.alert(
          '¡Pago Exitoso!',
          `Tu pago de ${formatCurrency(monto)} ha sido procesado correctamente.`,
          [
            {
              text: 'OK',
              onPress: () => {
                onPaymentSuccess(result.paymentIntentId!);
                onClose();
              }
            }
          ]
        );
      } else {
        throw new Error(result.error ?? 'Error desconocido en el pago');
      }

    } catch (error) {
      logger.error('❌ Error en el pago:', error);
      
      Alert.alert(
        'Error en el Pago',
        error instanceof Error ? error.message : 'Ocurrió un error inesperado',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const isVencido = () => {
    if (!pago.fecha_vencimiento) return false; // No puede estar vencido si no tiene fecha de vencimiento
    
    const today = new Date();
    const vencimiento = new Date(pago.fecha_vencimiento);
    return vencimiento < today && pago.estado?.toLowerCase() === 'pendiente';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center">
              <CreditCard size={24} color="#005456" />
              <Text className="text-xl font-bold text-gray-900 ml-2">
                Pagar con Stripe
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="p-2 bg-gray-100 rounded-full"
              disabled={loading}
            >
              <X size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Estado del pago */}
            {isVencido() && (
              <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex-row items-center">
                <AlertCircle size={20} color="#dc2626" />
                <Text className="text-red-600 font-medium ml-2">
                  Este pago está vencido
                </Text>
              </View>
            )}

            {/* Detalles del pago */}
            <View className="bg-gray-50 rounded-lg p-4 mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Detalles del Pago
              </Text>
              
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Concepto:</Text>
                  <Text className="font-medium text-gray-900 flex-1 text-right ml-2">
                    {descripcion}
                  </Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Monto:</Text>
                  <Text className="font-bold text-gray-900 text-lg">
                    {formatCurrency(monto)}
                  </Text>
                </View>
                
                {pago.fecha_vencimiento && (
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Vencimiento:</Text>
                    <Text className={`font-medium ${isVencido() ? 'text-red-600' : 'text-gray-900'}`}>
                      {new Date(pago.fecha_vencimiento).toLocaleDateString('es-EC')}
                    </Text>
                  </View>
                )}

                {pago.id_mascota && (
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Mascota:</Text>
                    <Text className="font-medium text-gray-900">
                      {pago.id_mascota.nombre}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Información de seguridad */}
            <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <CheckCircle size={20} color="#059669" />
                <Text className="text-green-800 font-medium ml-2">
                  Pago Seguro con Stripe
                </Text>
              </View>
              <Text className="text-green-700 text-sm">
                Tu información de pago está protegida con encriptación de nivel bancario. 
                Stripe es una plataforma de pagos líder mundial utilizada por millones de empresas.
              </Text>
            </View>

            {/* Nota sobre la interfaz de pago */}
            <View className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-blue-800 text-sm font-medium">
                  💡 Configuración de Visualización
                </Text>
                <TouchableOpacity
                  onPress={() => setUseHighContrast(!useHighContrast)}
                  className={`px-3 py-1 rounded-full ${
                    useHighContrast ? 'bg-blue-600' : 'bg-blue-200'
                  }`}
                >
                  <Text className={`text-xs font-medium ${
                    useHighContrast ? 'text-white' : 'text-blue-800'
                  }`}>
                    {useHighContrast ? 'Alto Contraste ✓' : 'Normal'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text className="text-blue-700 text-xs">
                {useHighContrast 
                  ? 'Modo de alto contraste activado para mejor visibilidad del texto.'
                  : 'La pantalla de pago usará colores estándar. Activa alto contraste si tienes dificultades para leer.'
                }
              </Text>
            </View>

            {/* Métodos de pago aceptados */}
            <View className="mb-6">
              <Text className="text-gray-600 text-sm text-center mb-2">
                Métodos de pago aceptados:
              </Text>
              <Text className="text-gray-500 text-sm text-center">
                Visa • Mastercard • American Express • Discover
              </Text>
            </View>
          </ScrollView>

          {/* Botones de acción */}
          <View className="space-y-3 pt-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handlePayWithStripe}
              disabled={loading}
              className={`flex-row items-center justify-center p-4 rounded-lg ${
                loading 
                  ? 'bg-gray-300' 
                  : 'bg-teal-600'
              }`}
            >
              {loading ? (
                <>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text className="text-white font-semibold ml-2">
                    Procesando...
                  </Text>
                </>
              ) : (
                <>
                  <CreditCard size={20} color="#ffffff" />
                  <Text className="text-white font-semibold text-lg ml-2">
                    Pagar {formatCurrency(monto)}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              disabled={loading}
              className="p-4 rounded-lg border border-gray-300"
            >
              <Text className="text-gray-700 font-medium text-center">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
