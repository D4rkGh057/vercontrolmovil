import React from 'react';
import { View, Text } from 'react-native';
import { CreditCard } from 'lucide-react-native';

export const EmptyPagos: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center px-6">
      <View className="bg-gray-100 rounded-full p-6 mb-4">
        <CreditCard size={48} color="#9CA3AF" />
      </View>
      
      <Text className="text-xl font-semibold text-gray-900 mb-2 text-center">
        No tienes pagos registrados
      </Text>
      
      <Text className="text-gray-600 text-center leading-6">
        Cuando tengas facturas o servicios por pagar, aparecerán aquí.
      </Text>
    </View>
  );
};
