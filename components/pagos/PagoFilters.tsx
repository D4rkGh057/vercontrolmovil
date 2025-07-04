import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Filter } from 'lucide-react-native';

interface PagoFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export const PagoFilters: React.FC<PagoFiltersProps> = ({
  selectedStatus,
  onStatusChange,
}) => {
  const statuses = [
    { key: 'todos', label: 'Todos', color: 'bg-gray-100 text-gray-800' },
    { key: 'pendiente', label: 'Pendientes', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'pagado', label: 'Pagados', color: 'bg-green-100 text-green-800' },
    { key: 'vencido', label: 'Vencidos', color: 'bg-red-100 text-red-800' },
  ];

  return (
    <View className="bg-white border-b border-gray-200 px-4 py-3">
      <View className="flex-row items-center mb-3">
        <Filter size={16} color="#6B7280" />
        <Text className="text-gray-700 font-medium ml-2">Filtrar por estado</Text>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row space-x-2">
          {statuses.map((status) => (
            <TouchableOpacity
              key={status.key}
              onPress={() => onStatusChange(status.key)}
              className={`px-4 py-2 rounded-full border ${
                selectedStatus === status.key
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedStatus === status.key
                    ? 'text-white'
                    : 'text-gray-700'
                }`}
              >
                {status.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
