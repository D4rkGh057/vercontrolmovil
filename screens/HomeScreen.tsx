import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, RefreshControl, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container } from '../components/Container';
import { useAuthStore } from 'stores/authStore';
import { useCitasStore } from '../stores/citasStore';
import { useMascotasStore } from '../stores/mascotasStore';
import { Cita } from '../types';
import {
  Heart,
  Calendar,
  MapPin,
  Dog,
  Cat,
  HeartHandshake
} from 'lucide-react-native';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { 
    citas, 
    loading: citasLoading, 
    getCitas 
  } = useCitasStore();
  
  const { 
    mascotas, 
    loading: mascotasLoading, 
    getMascotasByDueño 
  } = useMascotasStore();
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      console.log('🔍 HomeScreen - Iniciando carga de datos...');
      console.log('👤 Usuario actual:', user);
      console.log('🆔 ID del usuario:', user?.id);

      if (!user?.id) {
        console.error('❌ Usuario no autenticado o sin ID');
        throw new Error('El usuario no está autenticado correctamente');
      }

      setRefreshing(true);
      console.log('🚀 Realizando llamadas a la API usando stores...');
      
      // Cargar datos usando los stores
      await Promise.all([
        getCitas(),
        getMascotasByDueño(user.id)
      ]);

      console.log('🎉 Carga de datos completada exitosamente');
    } catch (error: any) {
      console.error('💥 Error loading data:', error);
      console.error('📊 Detalles del error:', {
        message: error?.message ?? 'Error desconocido',
        response: error?.response?.data,
        status: error?.response?.status
      });
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [getCitas, getMascotasByDueño]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Filtrar próximas citas (próximos 7 días)
  const proximasCitas = citas
    .filter((cita) => cita.estado === 'Pendiente')
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (citasLoading || mascotasLoading) {
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
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="bg-primary-500 rounded-2xl mx-4  p-6 mb-6">
          <View className="flex-row items-center justify-left">
            <Text className="text-white text-2xl font-bold">¡Hola! {user?.nombre}</Text>
            <View className="ml-2">
              <HeartHandshake size={24} color="#fff" />
            </View>
          </View>
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
            <Text className="text-2xl font-bold text-neutral-800 mt-2">{proximasCitas.length}</Text>
            <Text className="text-neutral-600 text-sm">Citas</Text>
          </View>
        </View>

        {/* Mis Mascotas */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-neutral-800">Mis Mascotas</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('Mascotas')}>
              <Text className="text-primary-500 font-bold">Ver todas</Text>
            </TouchableOpacity>
          </View>

          {mascotas.length > 0 ? (
            mascotas.slice(0, 2).map((mascota) => (
              <View key={mascota.id_mascota} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-neutral-200 rounded-full mr-3 items-center justify-center">
                    {mascota.especie === 'Perro' ? (
                      <Dog size={24} color="#94a3b8" />
                    ) : (
                      <Cat size={24} color="#94a3b8" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-neutral-800 text-base">{mascota.nombre}</Text>
                    <Text className="text-neutral-600 text-sm">{mascota.raza} • {mascota.sexo}</Text>
                  </View>
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

          {proximasCitas.length > 0 ? (
            proximasCitas.map((cita) => (
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
                  <Text className="text-neutral-600 text-sm ml-2">Dr. {cita.id_usuario?.nombre} {cita.id_usuario.apellido}</Text>
                </View>
              </View>
            ))
          ) : (
            <View className="bg-white rounded-xl p-4 items-center">
              <Text className="text-neutral-500">No tienes citas programadas</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Container>
  );
};
