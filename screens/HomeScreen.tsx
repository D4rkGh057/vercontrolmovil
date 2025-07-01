import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, RefreshControl, ActivityIndicator, Alert, Pressable, TouchableOpacity } from 'react-native';
import { Container } from '../components/Container';
import { citasService, mascotasService, recordatoriosService } from '../services/api';
import { Cita, Mascota, Recordatorio } from '../types';
import { 
  Heart,
  Calendar,
  MapPin,
  Clock,
  ChevronRight
} from 'lucide-react-native';

export const HomeScreen = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [citasResponse, mascotasResponse, recordatoriosResponse] = await Promise.all([
        citasService.getCitas(),
        mascotasService.getMascotas(),
        recordatoriosService.getRecordatorios()
      ]);
      
      // Filtrar próximas citas
      const proximasCitas = citasResponse.data
        .filter((cita: Cita) => cita.estado === 'Programada')
        .slice(0, 3);
      
      setCitas(proximasCitas);
      setMascotas(mascotasResponse.data);
      
      // Filtrar recordatorios pendientes
      const recordatoriosPendientes = recordatoriosResponse.data
        .filter((recordatorio: Recordatorio) => !recordatorio.completado)
        .slice(0, 3);
      
      setRecordatorios(recordatoriosPendientes);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <Container>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#005456" />
          <Text className="mt-2 text-neutral-600">Cargando...</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <ScrollView 
        className="flex-1 bg-neutral-50"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="bg-primary-500 rounded-2xl mx-4 mt-10 p-6 mb-6">
          <Text className="text-white text-2xl font-bold">¡Hola! 👋</Text>
          <Text className="text-white/90 text-base mt-1">Cuida a tus mascotas con amor</Text>
        </View>

        {/* Stats Cards */}
        <View className="flex-row justify-between px-4 mb-6">
          <View className="flex-1 bg-white rounded-xl p-4 mr-2 items-center shadow-sm">
            <Heart size={24} color="#ef4444" />
            <Text className="text-2xl font-bold text-neutral-800 mt-2">{mascotas.length}</Text>
            <Text className="text-neutral-600 text-sm">Mascotas</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 ml-2 items-center shadow-sm">
            <Calendar size={24} color="#005456" />
            <Text className="text-2xl font-bold text-neutral-800 mt-2">{citas.length}</Text>
            <Text className="text-neutral-600 text-sm">Citas</Text>
          </View>
        </View>

        {/* Mis Mascotas */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-neutral-800">Mis Mascotas</Text>
            <TouchableOpacity onPress={() => console.log('Ver todas las mascotas')}>
              <Text className="text-primary-500 font-bold">Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          {mascotas.length > 0 ? (
            mascotas.slice(0, 2).map((mascota) => (
              <View key={mascota.id_mascota} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-neutral-200 rounded-full mr-3 items-center justify-center">
                    <Text className="text-xl">{mascota.especie === 'Perro' ? '🐕' : '🐱'}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-neutral-800 text-base">{mascota.nombre}</Text>
                    <Text className="text-neutral-600 text-sm">{mascota.raza} • {mascota.sexo}</Text>
                  </View>
                  <ChevronRight size={20} color="#94a3b8" />
                </View>
              </View>
            ))
          ) : (
            <View className="bg-white rounded-xl p-4 items-center">
              <Text className="text-neutral-500">No tienes mascotas registradas</Text>
            </View>
          )}
        </View>

        {/* Próximas Citas */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-neutral-800">Próximas Citas</Text>
            <TouchableOpacity onPress={() => console.log('Ver todas las citas')}>
              <Text className="text-primary-500 font-bold">Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          {citas.length > 0 ? (
            citas.map((cita) => (
              <View key={cita.id_cita} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="font-bold text-neutral-800 text-base">{cita.id_mascota?.nombre}</Text>
                  <View className="bg-secondary-100 px-3 py-1 rounded-full">
                    <Text className="text-secondary-600 text-xs font-medium">{cita.motivo}</Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <Calendar size={16} color="#94a3b8" />
                  <Text className="text-neutral-600 text-sm ml-2">{formatDate(cita.fecha_hora)}</Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <MapPin size={16} color="#94a3b8" />
                  <Text className="text-neutral-600 text-sm ml-2">Dr. {cita.id_usuario?.nombre}</Text>
                </View>
              </View>
            ))
          ) : (
            <View className="bg-white rounded-xl p-4 items-center">
              <Text className="text-neutral-500">No tienes citas programadas</Text>
            </View>
          )}
        </View>

        {/* Recordatorios */}
        {recordatorios.length > 0 && (
          <View className="px-4 mb-6">
            <Text className="text-lg font-bold text-neutral-800 mb-4">Recordatorios</Text>
            
            {recordatorios.map((recordatorio) => (
              <View key={recordatorio.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm border-l-4 border-warning-400">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="font-bold text-neutral-800">{recordatorio.mascota?.nombre}</Text>
                    <Text className="text-neutral-600 text-sm">{recordatorio.descripcion}</Text>
                    <View className="flex-row items-center mt-1">
                      <Clock size={14} color="#f59e0b" />
                      <Text className="text-warning-600 text-xs ml-1">
                        Vence: {formatDate(recordatorio.fecha_programada)}
                      </Text>
                    </View>
                  </View>
                  <View className="w-6 h-6 bg-warning-100 rounded-full items-center justify-center">
                    <Text className="text-warning-600 text-xs">!</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Container>
  );
};
