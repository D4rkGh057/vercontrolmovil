import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, Plus } from 'lucide-react-native';

type FilterType = 'todos' | 'pendientes' | 'completados';

interface EmptyRecordatoriosProps {
  filter: FilterType;
  onAddRecordatorio: () => void;
}

export const EmptyRecordatorios: React.FC<EmptyRecordatoriosProps> = ({
  filter,
  onAddRecordatorio
}) => {
  const getEmptyMessage = () => {
    switch (filter) {
      case 'pendientes':
        return {
          title: 'No tienes recordatorios pendientes',
          subtitle: 'No hay recordatorios pendientes'
        };
      case 'completados':
        return {
          title: 'No tienes recordatorios completados',
          subtitle: 'No hay recordatorios completados'
        };
      default:
        return {
          title: 'No tienes recordatorios',
          subtitle: 'Crea recordatorios para el cuidado de tus mascotas'
        };
    }
  };

  const { title, subtitle } = getEmptyMessage();

  return (
    <View className="flex-1 justify-center items-center">
      <View className="mb-4">
        <Calendar size={64} color="#9CA3AF" />
      </View>
      <Text className="text-xl font-semibold text-gray-700 mb-2">
        {title}
      </Text>
      <Text className="text-gray-500 text-center mb-6">
        {subtitle}
      </Text>
      {filter === 'todos' && (
        <TouchableOpacity
          className="bg-primary-500 px-6 py-3 rounded-lg flex-row items-center"
          onPress={onAddRecordatorio}
        >
          <Plus size={16} color="white" />
          <Text className="text-white font-semibold ml-2">Crear Primer Recordatorio</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
