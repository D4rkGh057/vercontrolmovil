import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { colors } from '../constants/colors';

interface ColorBoxProps {
  color: string;
  name: string;
}

const ColorBox: React.FC<ColorBoxProps> = ({ color, name }) => (
  <View className="mb-2">
    <View 
      className="w-full h-12 rounded-lg mb-1"
      style={{ backgroundColor: color }}
    />
    <Text className="text-xs text-neutral-600 text-center">{name}</Text>
    <Text className="text-xs text-neutral-400 text-center">{color}</Text>
  </View>
);

export const ColorPalette: React.FC = () => (
  <ScrollView className="flex-1 bg-neutral-50 p-4">
    <Text className="text-2xl font-bold text-neutral-900 mb-6">
      Paleta de Colores VetControl
    </Text>
    
    {/* Colores Principales */}
    <View className="mb-8">
      <Text className="text-lg font-semibold text-neutral-800 mb-4">
        Colores Principales (Teal)
      </Text>
      <View className="grid grid-cols-5 gap-2">
        <ColorBox color={colors.primary[100]} name="primary-100" />
        <ColorBox color={colors.primary[300]} name="primary-300" />
        <ColorBox color={colors.primary[500]} name="primary-500" />
        <ColorBox color={colors.primary[700]} name="primary-700" />
        <ColorBox color={colors.primary[950]} name="primary-950" />
      </View>
    </View>
    
    {/* Colores Secundarios */}
    <View className="mb-8">
      <Text className="text-lg font-semibold text-neutral-800 mb-4">
        Colores Secundarios (Azul)
      </Text>
      <View className="grid grid-cols-5 gap-2">
        <ColorBox color={colors.secondary[100]} name="secondary-100" />
        <ColorBox color={colors.secondary[300]} name="secondary-300" />
        <ColorBox color={colors.secondary[500]} name="secondary-500" />
        <ColorBox color={colors.secondary[700]} name="secondary-700" />
        <ColorBox color={colors.secondary[900]} name="secondary-900" />
      </View>
    </View>
    
    {/* Estados */}
    <View className="mb-8">
      <Text className="text-lg font-semibold text-neutral-800 mb-4">
        Estados
      </Text>
      <View className="grid grid-cols-3 gap-2">
        <ColorBox color={colors.success[500]} name="success" />
        <ColorBox color={colors.warning[500]} name="warning" />
        <ColorBox color={colors.danger[500]} name="danger" />
      </View>
    </View>
    
    {/* Neutrales */}
    <View className="mb-8">
      <Text className="text-lg font-semibold text-neutral-800 mb-4">
        Colores Neutrales
      </Text>
      <View className="grid grid-cols-5 gap-2">
        <ColorBox color={colors.neutral[100]} name="neutral-100" />
        <ColorBox color={colors.neutral[300]} name="neutral-300" />
        <ColorBox color={colors.neutral[500]} name="neutral-500" />
        <ColorBox color={colors.neutral[700]} name="neutral-700" />
        <ColorBox color={colors.neutral[900]} name="neutral-900" />
      </View>
    </View>
    
    {/* Ejemplos de uso */}
    <View className="mb-8">
      <Text className="text-lg font-semibold text-neutral-800 mb-4">
        Ejemplos de Uso
      </Text>
      
      {/* Card con colores aplicados */}
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-neutral-200">
        <Text className="text-lg font-semibold text-neutral-900 mb-2">
          Ejemplo de Tarjeta
        </Text>
        <Text className="text-neutral-600 mb-4">
          Esta tarjeta usa la paleta de colores VetControl
        </Text>
        
        <View className="flex-row gap-2">
          <View className="bg-primary-500 px-3 py-2 rounded-md">
            <Text className="text-white text-sm font-medium">Primario</Text>
          </View>
          <View className="bg-success-500 px-3 py-2 rounded-md">
            <Text className="text-white text-sm font-medium">Éxito</Text>
          </View>
          <View className="bg-warning-500 px-3 py-2 rounded-md">
            <Text className="text-white text-sm font-medium">Alerta</Text>
          </View>
        </View>
      </View>
      
      {/* Estados de inventario */}
      <View className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
        <Text className="text-lg font-semibold text-neutral-900 mb-4">
          Estados de Inventario
        </Text>
        
        <View className="space-y-3">
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-success-500 mr-3" />
            <Text className="text-neutral-700">Disponible</Text>
          </View>
          
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-warning-500 mr-3" />
            <Text className="text-neutral-700">Stock Bajo</Text>
          </View>
          
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-danger-500 mr-3" />
            <Text className="text-neutral-700">Vencido</Text>
          </View>
        </View>
      </View>
    </View>
  </ScrollView>
);
