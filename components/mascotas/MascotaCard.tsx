import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Dog, Cat, Pencil } from 'lucide-react-native';
import { Mascota } from '../../types';

interface MascotaCardProps {
  mascota: Mascota;
  edad: string | number;
  onEdit: () => void;
  children?: React.ReactNode;
}

export const MascotaCard: React.FC<MascotaCardProps> = ({ mascota, edad, onEdit, children }) => {
  return (
    <View className="bg-white rounded-xl mb-4 shadow-sm">
      {/* Mascota Info */}
      <View className="p-4">
        <View className="flex-row items-center mb-3">
          <View className="w-12 h-12 bg-gray-200 rounded-full mr-3 items-center justify-center">
            {mascota.especie?.toLowerCase().includes('perro') ? <Dog /> : <Cat />}
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800">{mascota.nombre}</Text>
            <Text className="text-gray-600">Edad: {edad} años</Text>
          </View>
          <TouchableOpacity
            className="bg-[#E3F2FD] p-2 rounded-full"
            onPress={onEdit}
          >
            <Pencil size={22} color="#1565C0" />
          </TouchableOpacity>
        </View>
        <View className="space-y-2">
          <View className="flex-row justify-between">
            <View className="flex-1">
              <Text className="text-gray-600 text-sm">Raza: {mascota.raza}</Text>
              <Text className="text-gray-600 text-sm">Sexo: {mascota.sexo}</Text>
              <Text className="text-gray-600 text-sm">Color: {mascota.color}</Text>
              {!!mascota.peso_actual && (
                <Text className="text-gray-600 text-sm">Peso: {mascota.peso_actual} kg</Text>
              )}
            </View>
            <View className="flex-1">
              {!!mascota.tamano && (
                <Text className="text-gray-600 text-sm">Tamaño: {mascota.tamano}</Text>
              )}
              <Text className="text-gray-600 text-sm">
                Esterilizado: {mascota.esterilizado ? 'Sí' : 'No'}
              </Text>
              {!!mascota.num_microchip_collar && (
                <Text className="text-gray-600 text-sm">Microchip: {mascota.num_microchip_collar}</Text>
              )}
            </View>
          </View>
          <View className="pt-2 border-t border-gray-100">
            <Text className="text-gray-600 text-sm">Propietario:</Text>
            <Text className="text-gray-600 text-sm">{mascota.id_usuario.nombre} {mascota.id_usuario.apellido}</Text>
          </View>
        </View>
      </View>
      {children}
    </View>
  );
};
