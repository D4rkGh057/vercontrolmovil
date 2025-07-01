import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Container } from '../components/Container';
import { citasService } from '../services/api';
import { Cita } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Plus,
  CalendarDays
} from 'lucide-react-native';

export const CitasScreen = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todas' | 'programada' | 'completada' | 'cancelada'>('todas');

  const loadCitas = async () => {
    try {
      const response = await citasService.getCitas();
      setCitas(response.data);
    } catch (error) {
      console.error('Error loading citas:', error);
      Alert.alert('Error', 'No se pudieron cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCitas();
  }, []);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'programada': return 'bg-blue-100 text-blue-800';
      case 'completada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (estado: string) => {
    const iconProps = { size: 16, color: '#6B7280' };
    
    switch (estado) {
      case 'programada': return <Clock {...iconProps} color="#3B82F6" />;
      case 'completada': return <CheckCircle {...iconProps} color="#10B981" />;
      case 'cancelada': return <XCircle {...iconProps} color="#EF4444" />;
      default: return <Calendar {...iconProps} />;
    }
  };

  const handleCitaPress = (cita: Cita) => {
    const pesoInfo = cita.mascota?.peso ? `Peso: ${cita.mascota.peso} kg\n` : '';
    const citaDetails = `Mascota: ${cita.mascota?.nombre ?? 'N/A'}\nFecha: ${formatDate(cita.fecha)}\nHora: ${cita.hora}\nMotivo: ${cita.motivo}\nEstado: ${cita.estado}\n${pesoInfo}`;
    
    Alert.alert('Detalles de la Cita', citaDetails);
  };

  const handleAddCita = () => {
    Alert.alert('Nueva Cita', 'Funcionalidad próximamente disponible');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // HH:MM
  };

  const filteredCitas = filter === 'todas' 
    ? citas 
    : citas.filter(cita => cita.estado === filter);

  const getFilterButtonStyle = (filterType: string) => {
    return filter === filterType 
      ? 'bg-blue-500 text-white' 
      : 'bg-gray-200 text-gray-700';
  };

  if (loading) {
    return (
      <Container>
        <SafeAreaView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-2 text-gray-600">Cargando citas...</Text>
        </SafeAreaView>
      </Container>
    );
  }

  return (
    <Container>
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-800">Mis Citas</Text>
          <TouchableOpacity 
            className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
            onPress={handleAddCita}
          >
            <Plus size={16} color="white" />
            <Text className="text-white font-semibold ml-1">Nueva</Text>
          </TouchableOpacity>
        </View>

        {/* Filtros */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row space-x-2">
            {['todas', 'programada', 'completada', 'cancelada'].map((filterType) => (
              <TouchableOpacity
                key={filterType}
                className={`px-4 py-2 rounded-full ${getFilterButtonStyle(filterType)}`}
                onPress={() => setFilter(filterType as any)}
              >
                <Text className={`font-medium capitalize ${filter === filterType ? 'text-white' : 'text-gray-700'}`}>
                  {filterType}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {filteredCitas.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <View className="mb-4">
              <CalendarDays size={64} color="#9CA3AF" />
            </View>
            <Text className="text-xl font-semibold text-gray-700 mb-2">
              No tienes citas {filter === 'todas' ? '' : filter + 's'}
            </Text>
            <Text className="text-gray-500 text-center mb-6">
              {filter === 'todas' 
                ? 'Agenda tu primera cita con el veterinario'
                : `No hay citas con estado "${filter}"`
              }
            </Text>
            {filter === 'todas' && (
              <TouchableOpacity 
                className="bg-blue-500 px-6 py-3 rounded-lg flex-row items-center"
                onPress={handleAddCita}
              >
                <Plus size={16} color="white" />
                <Text className="text-white font-semibold ml-2">Agendar Primera Cita</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <ScrollView className="flex-1">
            {filteredCitas.map((cita) => (
              <TouchableOpacity
                key={cita.id}
                className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200 active:bg-gray-50"
                onPress={() => handleCitaPress(cita)}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-800">
                      {cita.mascota?.nombre ?? 'Mascota no especificada'}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {cita.mascota?.especie} • {cita.mascota?.raza}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <View className="mr-2">
                      {getStatusIcon(cita.estado)}
                    </View>
                    <View className={`px-3 py-1 rounded-full ${getStatusColor(cita.estado)}`}>
                      <Text className="text-xs font-medium capitalize">{cita.estado}</Text>
                    </View>
                  </View>
                </View>
                
                <Text className="text-base text-gray-700 mb-2">{cita.motivo}</Text>
                
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <Calendar size={14} color="#6B7280" />
                    <Text className="text-sm text-gray-600 ml-1">
                      {formatDate(cita.fecha)}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Clock size={14} color="#6B7280" />
                    <Text className="text-sm text-gray-600 ml-1">
                      {formatTime(cita.hora)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </Container>
  );
};
