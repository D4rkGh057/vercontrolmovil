import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Container } from '../components/Container';
import { RecordatorioCard, RecordatorioFilters, EmptyRecordatorios } from '../components/recordatorios';
import { useRecordatoriosStore } from '../stores/recordatoriosStore';
import {
  Plus
} from 'lucide-react-native';

export const RecordatoriosScreen = () => {
  const { 
    recordatorios, 
    loading, 
    getRecordatorios, 
    toggleComplete,
    deleteRecordatorio
  } = useRecordatoriosStore();
  
  const [filter, setFilter] = useState<'todos' | 'pendientes' | 'completados'>('pendientes');
  const [refreshing, setRefreshing] = useState(false);

  const loadRecordatorios = async () => {
    try {
      setRefreshing(true);
      await getRecordatorios();
    } catch (error) {
      console.error('Error loading recordatorios:', error);
      Alert.alert('Error', 'No se pudieron cargar los recordatorios');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getRecordatorios();
  }, [getRecordatorios]);

  const handleToggleComplete = async (id: string, completado: boolean) => {
    try {
      await toggleComplete(id, completado);
      Alert.alert('Éxito', 'Recordatorio actualizado correctamente');
    } catch (error) {
      console.error('Error updating recordatorio:', error);
      Alert.alert('Error', 'No se pudo actualizar el recordatorio');
    }
  };

  const handleDeleteRecordatorio = async (id: string) => {
    Alert.alert(
      'Eliminar Recordatorio',
      '¿Estás seguro de que quieres eliminar este recordatorio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const performDelete = async () => {
              try {
                await deleteRecordatorio(id);
                Alert.alert('Éxito', 'Recordatorio eliminado correctamente');
              } catch (error) {
                console.error('Error deleting recordatorio:', error);
                Alert.alert('Error', 'No se pudo eliminar el recordatorio');
              }
            };
            performDelete();
          }
        }
      ]
    );
  };

  const handleAddRecordatorio = () => {
    Alert.alert('Nuevo Recordatorio', 'Funcionalidad próximamente disponible');
  };

  const filteredRecordatorios = recordatorios.filter(recordatorio => {
    switch (filter) {
      case 'pendientes': return !recordatorio.completado;
      case 'completados': return recordatorio.completado;
      default: return true;
    }
  });

  // Debug: Verificar IDs únicos
  React.useEffect(() => {
    const ids = filteredRecordatorios.map(r => r.id_recordatorio);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      console.warn('⚠️ IDs de recordatorios duplicados encontrados:', ids);
    }
    console.log('🔍 Recordatorios filtrados:', filteredRecordatorios.length, 'IDs:', ids);
  }, [filteredRecordatorios]);

  const onRefresh = () => {
    setRefreshing(true);
    loadRecordatorios();
  };

  if (loading) {
    return (
      <Container>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-2 text-gray-600">Cargando recordatorios...</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <View className="flex-1 bg-neutral-50">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-800">Recordatorios</Text>
          <TouchableOpacity
            className="bg-primary-500 px-4 py-2 rounded-lg flex-row items-center"
            onPress={handleAddRecordatorio}
          >
            <Plus size={16} color="white" />
            <Text className="text-white font-semibold ml-1">Nuevo</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-gray-600 mb-6">Mantén al día el cuidado de tus mascotas</Text>

        {/* Filtros */}
        <RecordatorioFilters
          activeFilter={filter}
          onFilterChange={setFilter}
        />

        {filteredRecordatorios.length === 0 ? (
          <EmptyRecordatorios
            filter={filter}
            onAddRecordatorio={handleAddRecordatorio}
          />
        ) : (
          <ScrollView 
            className="flex-1" 
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            } 
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-4 ">
              {filteredRecordatorios.map((recordatorio, index) => (
                <RecordatorioCard
                  key={recordatorio.id_recordatorio || `recordatorio-${index}`}
                  recordatorio={recordatorio}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteRecordatorio}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </Container>
  );
};
