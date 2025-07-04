import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
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
  const [filter, setFilter] = useState<'todas' | 'Pendiente' | 'Completada' | 'Cancelada'>('todas');
  const [refreshing, setRefreshing] = useState(false);

  const loadCitas = async () => {
    try {
      const response = await citasService.getCitas();
      setCitas(response.data);
    } catch (error) {
      console.error('Error loading citas:', error);
      Alert.alert('Error', 'No se pudieron cargar las citas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCitas();
  }, []);

  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'bg-blue-100 text-blue-800';
      case 'completada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (estado: string) => {
    const iconProps = { size: 16, color: '#6B7280' };

    switch (estado.toLowerCase()) {
      case 'pendiente': return <Clock {...iconProps} color="#3B82F6" />;
      case 'completada': return <CheckCircle {...iconProps} color="#10B981" />;
      case 'cancelada': return <XCircle {...iconProps} color="#EF4444" />;
      default: return <Calendar {...iconProps} />;
    }
  };

  const handleCitaPress = (cita: Cita) => {
    const fechaHora = new Date(cita.fecha_hora);
    const fecha = fechaHora.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const hora = fechaHora.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const citaDetails = `Mascota: ${cita.id_mascota?.nombre ?? 'N/A'}\nFecha: ${fecha}\nHora: ${hora}\nMotivo: ${cita.motivo}\nEstado: ${cita.estado}`;

    Alert.alert('Detalles de la Cita', citaDetails);
  };

  const handleAddCita = () => {
    Alert.alert('Nueva Cita', 'Funcionalidad próximamente disponible');
  };

  const formatDate = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredCitas = filter === 'todas'
    ? citas
    : citas.filter(cita => cita.estado === filter);

  const getFilterButtonStyle = (filterType: string) => {
    return filter === filterType
      ? 'bg-primary-500 text-white'
      : 'bg-gray-200 text-gray-700';
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCitas();
  };

  if (loading) {
    return (
      <Container>
        <SafeAreaView className="flex-1 justify-center items-center px-4">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-2 text-gray-600">Cargando citas...</Text>
        </SafeAreaView>
      </Container>
    );
  }

  return (
    <Container>
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-4 ">
          <Text className="text-2xl font-bold text-gray-800">Mis Citas</Text>
          <TouchableOpacity
            className="bg-primary-500 px-4 py-2 rounded-lg flex-row items-center"
            onPress={handleAddCita}
          >
            <Plus size={16} color="white" />
            <Text className="text-white font-semibold ml-1">Nueva</Text>
          </TouchableOpacity>
        </View>

        {/* Filtros */}
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          >
            {['todas', 'Pendiente', 'Completada', 'Cancelada'].map((filterType, index) => (
              <TouchableOpacity
                key={`filter-${filterType}-${index}`}
                className={`px-4 py-2 rounded-full mr-3 min-w-0 ${getFilterButtonStyle(filterType)}`}
                onPress={() => setFilter(filterType as any)}
                style={{ minWidth: 'auto' }}
              >
                <Text className={`font-medium ${filter === filterType ? 'text-white' : 'text-gray-700'}`}>
                  {filterType === 'todas' ? 'Todas' : filterType}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView className="mb-4" refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } showsVerticalScrollIndicator={false}>
          {filteredCitas.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <View className="mb-4">
                <CalendarDays size={64} color="#9CA3AF" />
              </View>
              <Text className="text-xl font-semibold text-gray-700 mb-2">
                {filter === 'todas' ? 'No tienes citas' : `No tienes citas ${filter.toLowerCase()}s`}
              </Text>
              <Text className="text-gray-500 text-center mb-6">
                {filter === 'todas'
                  ? 'Agenda tu primera cita con el veterinario'
                  : `No hay citas con estado "${filter.toLowerCase()}"`
                }
              </Text>
              {filter === 'todas' && (
                <TouchableOpacity
                  className="bg-primary-500 px-6 py-3 rounded-lg flex-row items-center"
                  onPress={handleAddCita}
                >
                  <Plus size={16} color="white" />
                  <Text className="text-white font-semibold ml-2">Agendar Primera Cita</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {filteredCitas.map((cita) => (
                <TouchableOpacity
                  key={cita.id_cita}
                  className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100 active:bg-gray-50"
                  onPress={() => handleCitaPress(cita)}
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-gray-800 mb-1">
                        {cita.id_mascota?.nombre ?? 'Mascota no especificada'}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {cita.id_mascota?.especie} • {cita.id_mascota?.raza}
                      </Text>
                    </View>
                    <View className="flex-row items-center ml-2">
                      <View className="mr-2">
                        {getStatusIcon(cita.estado)}
                      </View>
                      <View className={`px-3 py-1 rounded-full ${getStatusColor(cita.estado)}`}>
                        <Text className="text-xs font-medium">{cita.estado}</Text>
                      </View>
                    </View>
                  </View>

                  <Text className="text-base text-gray-700 mb-3">{cita.motivo}</Text>

                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <Calendar size={14} color="#6B7280" />
                      <Text className="text-sm text-gray-600 ml-1">
                        {formatDate(cita.fecha_hora)}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Clock size={14} color="#6B7280" />
                      <Text className="text-sm text-gray-600 ml-1">
                        {formatTime(cita.fecha_hora)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              <View className="h-4" />
            </ScrollView>
          )}
        </ScrollView>
      </View>
    </Container>
  );
};
