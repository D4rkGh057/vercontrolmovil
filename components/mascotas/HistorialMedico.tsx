import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, ChevronDown, ChevronRight } from 'lucide-react-native';

interface HistorialItem {
  id: string;
  tipo: string;
  titulo: string;
  fecha: string;
  veterinario: string;
  notas?: string;
}

interface HistorialMedicoProps {
  isExpanded: boolean;
  historial: HistorialItem[];
  onToggle: () => void;
  getHistorialIcon: (tipo: string) => React.ReactNode;
  formatDate: (dateString: string) => string;
}

const getHistorialBackgroundColor = (tipo: string): string => {
  const colors: Record<string, string> = {
    'vacuna': '#DCFCE7',
    'consulta': '#DBEAFE',
    'cirugia': '#FEE2E2',
    'medicacion': '#FEF3C7',
    'chequeo': '#EDF2FF',
    'examen': '#D1FAE5',
    'desparasitacion': '#E0F2FE'
  };
  
  return colors[tipo] || '#F3F4F6';
};

export const HistorialMedico: React.FC<HistorialMedicoProps> = ({
  isExpanded,
  historial,
  onToggle,
  getHistorialIcon,
  formatDate
}) => (
  <View className="border-t border-gray-100">
    <TouchableOpacity
      className="flex-row justify-between items-center p-4"
      onPress={onToggle}
    >
      <View className="flex-row items-center">
        <Calendar size={16} color="#6B7280" />
        <Text className="font-medium text-gray-800 ml-2">Historial Médico</Text>
      </View>
      <View className="flex-row items-center">
        <Text className="text-gray-600 text-sm mr-2">{historial.length} registros</Text>
        {isExpanded ? (
          <ChevronDown size={20} color="#6B7280" />
        ) : (
          <ChevronRight size={20} color="#6B7280" />
        )}
      </View>
    </TouchableOpacity>
    {isExpanded && historial.length > 0 && (
      <View className="px-4 pb-4">
        {historial.map((item) => (
          <View key={item.id} className="flex-row items-start py-3 border-b border-gray-50 last:border-b-0">
            <View className="w-8 h-8 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: getHistorialBackgroundColor(item.tipo) }}>
              {getHistorialIcon(item.tipo)}
            </View>
            <View className="flex-1">
              <View className="flex-row justify-between items-start mb-1">
                <Text className="font-medium text-gray-800 flex-1">{item.titulo}</Text>
                <Text className="text-xs text-gray-500 ml-2">{formatDate(item.fecha)}</Text>
              </View>
              <Text className="text-sm text-gray-600">{item.veterinario}</Text>
            </View>
          </View>
        ))}
      </View>
    )}
  </View>
);
