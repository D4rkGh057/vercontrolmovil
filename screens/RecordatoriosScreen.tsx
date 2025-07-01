import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Container } from '../components/Container';
import { recordatoriosService } from '../services/api';
import { Recordatorio } from '../types';
import { 
  Syringe, 
  Pill, 
  Bug, 
  Calendar, 
  Plus,
  AlertTriangle,
  CheckCircle
} from 'lucide-react-native';

export const RecordatoriosScreen = () => {
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todos' | 'pendientes' | 'completados'>('pendientes');

  const loadRecordatorios = async () => {
    try {
      const response = await recordatoriosService.getRecordatorios();
      setRecordatorios(response.data);
    } catch (error) {
      console.error('Error loading recordatorios:', error);
      Alert.alert('Error', 'No se pudieron cargar los recordatorios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecordatorios();
  }, []);

  const getRecordatorioIcon = (tipo: string) => {
    const iconProps = { size: 24, color: '#6B7280' };
    
    switch (tipo) {
      case 'vacuna': return <Syringe {...iconProps} color="#3B82F6" />;
      case 'medicamento': return <Pill {...iconProps} color="#8B5CF6" />;
      case 'desparasitacion': return <Bug {...iconProps} color="#F59E0B" />;
      default: return <Calendar {...iconProps} />;
    }
  };

  const getRecordatorioBgColor = (tipo: string, completado: boolean) => {
    if (completado) return 'bg-green-50 border-green-200';
    
    switch (tipo) {
      case 'vacuna': return 'bg-blue-50 border-blue-200';
      case 'medicamento': return 'bg-purple-50 border-purple-200';
      case 'desparasitacion': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const isOverdue = (fecha: string) => {
    const today = new Date();
    const recordatorioDate = new Date(fecha);
    return recordatorioDate < today;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRecordatorioPress = (recordatorio: Recordatorio) => {
    const overdueText = isOverdue(recordatorio.fecha_programada) && !recordatorio.completado ? '\n⚠️ VENCIDO' : '';
    const recordatorioDetails = `Mascota: ${recordatorio.mascota?.nombre ?? 'N/A'}\nTipo: ${recordatorio.tipo}\nDescripción: ${recordatorio.descripcion}\nFecha programada: ${formatDate(recordatorio.fecha_programada)}\nEstado: ${recordatorio.completado ? 'Completado' : 'Pendiente'}${overdueText}`;
    
    Alert.alert(
      'Detalle del Recordatorio',
      recordatorioDetails,
      [
        { text: 'Cerrar', style: 'cancel' },
        ...(recordatorio.completado ? [] : [{ 
          text: 'Marcar como Completado', 
          onPress: () => handleToggleComplete(recordatorio.id, true)
        }])
      ]
    );
  };

  const handleToggleComplete = async (id: string, completado: boolean) => {
    try {
      await recordatoriosService.updateRecordatorio(id, { completado });
      setRecordatorios(prev => 
        prev.map(r => r.id === id ? { ...r, completado } : r)
      );
      Alert.alert('Éxito', 'Recordatorio actualizado correctamente');
    } catch (error) {
      console.error('Error updating recordatorio:', error);
      Alert.alert('Error', 'No se pudo actualizar el recordatorio');
    }
  };

  const handleAddRecordatorio = () => {
    Alert.alert('Nuevo Recordatorio', 'Funcionalidad próximamente disponible');
  };

  const getDateTextColor = (overdue: boolean, completado: boolean) => {
    if (overdue) return 'text-red-600';
    if (completado) return 'text-green-600';
    return 'text-gray-600';
  };

  const filteredRecordatorios = recordatorios.filter(recordatorio => {
    switch (filter) {
      case 'pendientes': return !recordatorio.completado;
      case 'completados': return recordatorio.completado;
      default: return true;
    }
  });

  const getFilterButtonStyle = (filterType: string) => {
    return filter === filterType 
      ? 'bg-blue-500 text-white' 
      : 'bg-gray-200 text-gray-700';
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
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-800">Recordatorios</Text>
          <TouchableOpacity 
            className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
            onPress={handleAddRecordatorio}
          >
            <Plus size={16} color="white" />
            <Text className="text-white font-semibold ml-1">Nuevo</Text>
          </TouchableOpacity>
        </View>

        {/* Filtros */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row space-x-2">
            {['todos', 'pendientes', 'completados'].map((filterType) => (
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

        {filteredRecordatorios.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <View className="mb-4">
              <Calendar size={64} color="#9CA3AF" />
            </View>
            <Text className="text-xl font-semibold text-gray-700 mb-2">
              No tienes recordatorios {filter === 'todos' ? '' : filter}
            </Text>
            <Text className="text-gray-500 text-center mb-6">
              {filter === 'todos' 
                ? 'Crea recordatorios para el cuidado de tus mascotas'
                : `No hay recordatorios ${filter}`
              }
            </Text>
            {filter === 'todos' && (
              <TouchableOpacity 
                className="bg-blue-500 px-6 py-3 rounded-lg flex-row items-center"
                onPress={handleAddRecordatorio}
              >
                <Plus size={16} color="white" />
                <Text className="text-white font-semibold ml-2">Crear Primer Recordatorio</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <ScrollView className="flex-1">
            {filteredRecordatorios.map((recordatorio) => {
              const overdue = isOverdue(recordatorio.fecha_programada) && !recordatorio.completado;
              
              return (
                <TouchableOpacity
                  key={recordatorio.id}
                  className={`rounded-lg p-4 mb-3 border ${getRecordatorioBgColor(recordatorio.tipo, recordatorio.completado)} ${overdue ? 'border-red-300 bg-red-50' : ''} active:opacity-80`}
                  onPress={() => handleRecordatorioPress(recordatorio)}
                >
                  <View className="flex-row items-center">
                    <View className="mr-3">
                      {getRecordatorioIcon(recordatorio.tipo)}
                    </View>
                    <View className="flex-1">
                      <View className="flex-row justify-between items-center mb-1">
                        <Text className="font-bold text-gray-800">
                          {recordatorio.mascota?.nombre ?? 'Mascota'}
                        </Text>
                        <View className="flex-row items-center">
                          {recordatorio.completado && (
                            <View className="mr-2">
                              <CheckCircle size={16} color="#10B981" />
                            </View>
                          )}
                          {overdue && (
                            <View className="mr-2">
                              <AlertTriangle size={16} color="#EF4444" />
                            </View>
                          )}
                        </View>
                      </View>
                      <Text className="text-gray-700 mb-1 capitalize">{recordatorio.tipo}</Text>
                      <Text className="text-sm text-gray-600 mb-2">{recordatorio.descripcion}</Text>
                      <Text className={`text-sm font-medium ${getDateTextColor(overdue, recordatorio.completado)}`}>
                        {formatDate(recordatorio.fecha_programada)}
                        {overdue && ' (Vencido)'}
                        {recordatorio.completado && ' (Completado)'}
                      </Text>
                    </View>
                    <Text className="text-gray-400 text-lg ml-2">›</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    </Container>
  );
};
