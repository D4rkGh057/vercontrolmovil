import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

type FilterType = 'todos' | 'pendientes' | 'completados';

interface RecordatorioFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const RecordatorioFilters: React.FC<RecordatorioFiltersProps> = ({
  activeFilter,
  onFilterChange
}) => {
  const filters: { key: FilterType; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'pendientes', label: 'Pendientes' },
    { key: 'completados', label: 'Completados' }
  ];

  const getFilterButtonStyle = (filterType: FilterType) => {
    return activeFilter === filterType
      ? 'bg-primary-500 text-white'
      : 'bg-gray-200 text-gray-700';
  };

  const getFilterTextStyle = (filterType: FilterType) => {
    return activeFilter === filterType ? 'text-white' : 'text-gray-700';
  };

  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 0 }}
      >
        <View className="flex-row gap-2">
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              className={`px-4 py-2 rounded-full ${getFilterButtonStyle(filter.key)}`}
              onPress={() => onFilterChange(filter.key)}
            >
              <Text className={`font-medium ${getFilterTextStyle(filter.key)}`}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
