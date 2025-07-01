import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Container } from '../components/Container';
import { mascotasService } from '../services/api';
import { Mascota } from '../types';
import { 
  Plus,
  ChevronDown,
  ChevronRight,
  Calendar,
  Activity,
  Stethoscope,
  Pencil,
  Dog,
  Cat
} from 'lucide-react-native';

interface HistorialItem {
  id: string;
  tipo: 'vacuna' | 'consulta' | 'cirugia' | 'desparasitacion';
  titulo: string;
  fecha: string;
  veterinario: string;
  notas?: string;
}

export const MascotasScreen = () => {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMascota, setExpandedMascota] = useState<string | null>(null);

  // Datos de ejemplo para el historial médico
  const historialMedico: Record<string, HistorialItem[]> = {
    'max': [
      {
        id: '1',
        tipo: 'vacuna',
        titulo: 'Vacuna antirrábica',
        fecha: '2023-12-01',
        veterinario: 'Dr. García'
      },
      {
        id: '2',
        tipo: 'consulta',
        titulo: 'Revisión general',
        fecha: '2023-11-15',
        veterinario: 'Dr. García'
      }
    ],
    'luna': [
      {
        id: '3',
        tipo: 'vacuna',
        titulo: 'Vacuna triple felina',
        fecha: '2023-11-20',
        veterinario: 'Dr. Martínez'
      },
      {
        id: '4',
        tipo: 'cirugia',
        titulo: 'Esterilización',
        fecha: '2023-10-10',
        veterinario: 'Dr. Martínez'
      }
    ]
  };

  const loadMascotas = async () => {
    try {
      const response = await mascotasService.getMascotas();
      setMascotas(response.data);
    } catch (error) {
      console.error('Error loading mascotas:', error);
      Alert.alert('Error', 'No se pudieron cargar las mascotas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMascotas();
  }, []);

  const handleAddMascota = () => {
    Alert.alert('Agregar Mascota', 'Funcionalidad próximamente disponible');
  };

  const toggleHistorial = (mascotaId: string) => {
    setExpandedMascota(expandedMascota === mascotaId ? null : mascotaId);
  };

  const getHistorialIcon = (tipo: string) => {
    const iconProps = { size: 16, color: '#6B7280' };
    
    switch (tipo) {
      case 'vacuna':
        return <Activity {...iconProps} color="#059669" />;
      case 'consulta':
        return <Stethoscope {...iconProps} color="#0284C7" />;
      case 'cirugia':
        return <Calendar {...iconProps} color="#DC2626" />;
      default:
        return <Calendar {...iconProps} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <Container>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-2 text-gray-600">Cargando mascotas...</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <View className="flex-1 px-2">
        {/* Header */}
        <View className="flex-row justify-between items-center mt-10 mb-2">
          <Text className="text-2xl font-bold text-gray-800">Mis Mascotas</Text>
          <TouchableOpacity 
            className="bg-gray-800 px-4 py-2 rounded-lg flex-row items-center"
            onPress={handleAddMascota}
          >
            <Plus size={16} color="white" />
            <Text className="text-white font-medium ml-1">Agregar</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-gray-600 mb-6">Gestiona la información de tus mascotas</Text>

        {mascotas.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-xl font-semibold text-gray-700 mb-2">
              No tienes mascotas registradas
            </Text>
            <Text className="text-gray-500 text-center mb-6">
              Agrega tu primera mascota para comenzar a gestionar su cuidado
            </Text>
            <TouchableOpacity 
              className="bg-blue-500 px-6 py-3 rounded-lg flex-row items-center"
              onPress={handleAddMascota}
            >
              <Plus size={16} color="white" />
              <Text className="text-white font-semibold ml-2">Agregar Primera Mascota</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {mascotas.map((mascota) => {
              const mascotaKey = mascota.nombre.toLowerCase();
              const historial = historialMedico[mascotaKey] || [];
              const isExpanded = expandedMascota === mascota.id?.toString();

              return (
                <View key={mascota.id} className="bg-white rounded-xl mb-4 shadow-sm">
                  {/* Mascota Info */}
                  <View className="p-4">
                    <View className="flex-row items-center mb-3">
                      <View className="w-12 h-12 bg-gray-200 rounded-full mr-3 items-center justify-center">
                        {mascota.especie?.toLowerCase().includes('perro') ?  <Dog/> : <Cat/>}
                      </View>
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-800">{mascota.nombre}</Text>
                        <Text className="text-gray-600">{mascota.raza} • {mascota.edad} años</Text>
                      </View>
                        <Pencil size={16} color="#6B7280" />
                    </View>

                    <View className="flex-row">
                      <Text className="text-gray-600 mr-4">{mascota.peso ?? '25'} kg</Text>
                      <Text className="text-gray-600">{mascota.color ?? 'Dorado'}</Text>
                    </View>
                  </View>

                  {/* Historial Médico */}
                  <View className="border-t border-gray-100">
                    <TouchableOpacity 
                      className="flex-row justify-between items-center p-4"
                      onPress={() => toggleHistorial(mascota.id?.toString() || '')}
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
                                  style={{ backgroundColor: item.tipo === 'vacuna' ? '#DCFCE7' : '#DBEAFE' }}>
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
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </Container>
  );
};
