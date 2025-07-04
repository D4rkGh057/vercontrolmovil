import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { X, Calendar, PawPrint } from 'lucide-react-native';
import { Recordatorio } from '../../types';
import { useMascotasStore } from '../../stores/mascotasStore';
import { useAuthStore } from '../../stores/authStore';

interface AddRecordatorioModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (recordatorioData: Partial<Recordatorio>) => Promise<void>;
}

const TIPOS_RECORDATORIO = [
  { value: 'vacuna', label: 'Vacuna', emoji: '💉' },
  { value: 'medicamento', label: 'Medicamento', emoji: '💊' },
  { value: 'desparasitacion', label: 'Desparasitación', emoji: '🧪' }
] as const;

export const AddRecordatorioModal: React.FC<AddRecordatorioModalProps> = ({
  visible,
  onClose,
  onSubmit
}) => {
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo] = useState<'vacuna' | 'medicamento' | 'desparasitacion'>('vacuna');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [selectedMascota, setSelectedMascota] = useState<string>('');
  
  const { mascotas, getMascotasByDueño } = useMascotasStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (visible && user?.id) {
      getMascotasByDueño(user.id);
    }
  }, [visible, user?.id, getMascotasByDueño]);

  const resetForm = () => {
    setTipo('vacuna');
    setTitulo('');
    setDescripcion('');
    setFecha('');
    setSelectedMascota('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatDate = (dateString: string) => {
    // Convertir formato DD/MM/YYYY a YYYY-MM-DD para el backend
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateString;
  };

  const validateForm = () => {
    if (!titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return false;
    }
    if (!descripcion.trim()) {
      Alert.alert('Error', 'La descripción es obligatoria');
      return false;
    }
    if (!fecha.trim()) {
      Alert.alert('Error', 'La fecha es obligatoria');
      return false;
    }
    if (!selectedMascota) {
      Alert.alert('Error', 'Debes seleccionar una mascota');
      return false;
    }

    // Validar formato de fecha DD/MM/YYYY
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    if (!dateRegex.test(fecha)) {
      Alert.alert('Error', 'La fecha debe tener el formato DD/MM/YYYY');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const mascotaSeleccionada = mascotas.find(m => m.id_mascota === selectedMascota);
      if (!mascotaSeleccionada) {
        Alert.alert('Error', 'Mascota no encontrada');
        return;
      }

      const recordatorioData: Partial<Recordatorio> = {
        tipo,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        fecha_programada: formatDate(fecha),
        completado: false,
        id_mascota: mascotaSeleccionada
      };

      await onSubmit(recordatorioData);
      handleClose();
      Alert.alert('Éxito', 'Recordatorio creado correctamente');
    } catch (error) {
      console.error('Error creating recordatorio:', error);
      Alert.alert('Error', 'No se pudo crear el recordatorio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-800">Nuevo Recordatorio</Text>
          <TouchableOpacity onPress={handleClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Tipo de Recordatorio */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-3">Tipo de Recordatorio</Text>
            <View className="flex-row gap-3">
              {TIPOS_RECORDATORIO.map((tipoOption) => (
                <TouchableOpacity
                  key={tipoOption.value}
                  className={`flex-1 p-3 rounded-lg border-2 ${
                    tipo === tipoOption.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white'
                  }`}
                  onPress={() => setTipo(tipoOption.value)}
                >
                  <Text className="text-center text-2xl mb-1">{tipoOption.emoji}</Text>
                  <Text className={`text-center text-sm font-medium ${
                    tipo === tipoOption.value ? 'text-primary-700' : 'text-gray-600'
                  }`}>
                    {tipoOption.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Mascota */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-3">
              <PawPrint size={16} color="#374151" /> Mascota
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
              {mascotas.map((mascota) => (
                <TouchableOpacity
                  key={mascota.id_mascota}
                  className={`p-3 rounded-lg border-2 min-w-[120px] ${
                    selectedMascota === mascota.id_mascota
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white'
                  }`}
                  onPress={() => setSelectedMascota(mascota.id_mascota)}
                >
                  <Text className={`text-center font-medium ${
                    selectedMascota === mascota.id_mascota ? 'text-primary-700' : 'text-gray-700'
                  }`}>
                    {mascota.nombre}
                  </Text>
                  <Text className="text-center text-xs text-gray-500 mt-1">
                    {mascota.especie} • {mascota.raza}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {mascotas.length === 0 && (
              <Text className="text-gray-500 text-center py-4">
                No tienes mascotas registradas
              </Text>
            )}
          </View>

          {/* Título */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-3">Título</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base"
              placeholder="Ej: Vacuna anual, Medicamento diario..."
              value={titulo}
              onChangeText={setTitulo}
              maxLength={100}
            />
          </View>

          {/* Descripción */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-3">Descripción</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base h-24"
              placeholder="Describe los detalles del recordatorio..."
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
          </View>

          {/* Fecha */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-3">
              <Calendar size={16} color="#374151" /> Fecha Programada
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base"
              placeholder="DD/MM/YYYY"
              value={fecha}
              onChangeText={setFecha}
              maxLength={10}
              keyboardType="numeric"
            />
            <Text className="text-xs text-gray-500 mt-1">
              Formato: DD/MM/YYYY (Ej: 25/12/2024)
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="p-4 border-t border-gray-200">
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-gray-200 py-3 rounded-lg"
              onPress={handleClose}
              disabled={loading}
            >
              <Text className="text-center font-semibold text-gray-700">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-primary-500 py-3 rounded-lg"
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center font-semibold text-white">Crear Recordatorio</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
