import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { X, Save } from 'lucide-react-native';
import { Usuario } from '../types';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: Usuario;
  onSave: (userData: Partial<Usuario>) => Promise<void>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    nombre: user.nombre || '',
    apellido: user.apellido || '',
    email: user.email || '',
    telefono: user.telefono || '',
    direccion: user.direccion || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.email.trim()) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios (nombre, apellido y email)');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔄 Enviando datos de actualización:', formData);
      await onSave(formData);
      onClose();
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      let errorMessage = 'No se pudo actualizar el perfil. Inténtalo de nuevo.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      email: user.email || '',
      telefono: user.telefono || '',
      direccion: user.direccion || '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 justify-center px-4">
        <View className="bg-white rounded-lg max-h-[80%]">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-800">Editar Perfil</Text>
            <TouchableOpacity onPress={handleClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
            {/* Nombre */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800"
                value={formData.nombre}
                onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                placeholder="Ingresa tu nombre"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Apellido */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Apellido *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800"
                value={formData.apellido}
                onChangeText={(text) => setFormData({ ...formData, apellido: text })}
                placeholder="Ingresa tu apellido"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Email *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text.toLowerCase() })}
                placeholder="Ingresa tu email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Teléfono */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800"
                value={formData.telefono}
                onChangeText={(text) => setFormData({ ...formData, telefono: text })}
                placeholder="Ingresa tu teléfono"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            {/* Dirección */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Dirección
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800"
                value={formData.direccion}
                onChangeText={(text) => setFormData({ ...formData, direccion: text })}
                placeholder="Ingresa tu dirección"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            <Text className="text-xs text-gray-500 mb-4">
              * Campos obligatorios
            </Text>
          </ScrollView>

          {/* Buttons */}
          <View className="flex-row p-4 border-t border-gray-200 gap-3">
            <TouchableOpacity
              className="flex-1 py-3 rounded-lg border border-gray-300"
              onPress={handleClose}
              disabled={isLoading}
            >
              <Text className="text-center text-gray-700 font-medium">
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg flex-row items-center justify-center ${
                isLoading ? 'bg-blue-300' : 'bg-blue-500'
              }`}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Save size={16} color="white" />
              <Text className="text-white font-medium ml-2">
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
