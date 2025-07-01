import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { X, Dog, Cat } from 'lucide-react-native';
import { Mascota } from '../../types';

interface MascotaForm {
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  fecha_nacimiento: string;
  color: string;
}

interface EditMascotaModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editingMascota: boolean;
  mascotaForm: MascotaForm;
  updateFormField: (field: keyof MascotaForm, value: string) => void;
  originalMascota: Mascota | null;
}

export const EditMascotaModal: React.FC<EditMascotaModalProps> = ({
  visible,
  onClose,
  onSubmit,
  editingMascota,
  mascotaForm,
  updateFormField,
  originalMascota
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl min-h-[70%] max-h-[90%]">
          {/* Header */}
          <View className="flex-row justify-between items-center p-6 pb-4 border-b border-gray-100">
            <Text className="text-xl font-bold text-gray-800">
              Editar Mascota
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-2 rounded-full bg-gray-100"
            >
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            {/* Nombre */}
            <View className="mb-4 mt-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </Text>
              <TextInput
                value={mascotaForm.nombre}
                onChangeText={(value) => updateFormField('nombre', value)}
                placeholder="Nombre de tu mascota"
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Especie */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Especie *
              </Text>
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={() => updateFormField('especie', 'Perro')}
                  className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-lg border ${
                    mascotaForm.especie === 'Perro'
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <Dog
                    size={20}
                    color={mascotaForm.especie === 'Perro' ? '#3B82F6' : '#6B7280'}
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      mascotaForm.especie === 'Perro' ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    Perro
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => updateFormField('especie', 'Gato')}
                  className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-lg border ${
                    mascotaForm.especie === 'Gato'
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <Cat
                    size={20}
                    color={mascotaForm.especie === 'Gato' ? '#3B82F6' : '#6B7280'}
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      mascotaForm.especie === 'Gato' ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    Gato
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Raza */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Raza *
              </Text>
              <TextInput
                value={mascotaForm.raza}
                onChangeText={(value) => updateFormField('raza', value)}
                placeholder="Ej: Labrador, Persa, Mestizo"
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Sexo */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Sexo *
              </Text>
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={() => updateFormField('sexo', 'Macho')}
                  className={`flex-1 py-3 px-4 rounded-lg border ${
                    mascotaForm.sexo === 'Macho'
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <Text
                    className={`text-center font-medium ${
                      mascotaForm.sexo === 'Macho' ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    Macho
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => updateFormField('sexo', 'Hembra')}
                  className={`flex-1 py-3 px-4 rounded-lg border ${
                    mascotaForm.sexo === 'Hembra'
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <Text
                    className={`text-center font-medium ${
                      mascotaForm.sexo === 'Hembra' ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    Hembra
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Fecha de nacimiento */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Fecha de nacimiento
              </Text>
              <TextInput
                value={mascotaForm.fecha_nacimiento}
                onChangeText={(value) => updateFormField('fecha_nacimiento', value)}
                placeholder="YYYY-MM-DD"
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
              <Text className="text-xs text-gray-500 mt-1">
                Formato: YYYY-MM-DD (ejemplo: 2022-03-15)
              </Text>
            </View>

            {/* Color */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Color *
              </Text>
              <TextInput
                value={mascotaForm.color}
                onChangeText={(value) => updateFormField('color', value)}
                placeholder="Ej: Café, Negro, Blanco, Atigrado"
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="p-6 pt-4 border-t border-gray-100">
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 py-3 px-4 rounded-lg border border-gray-300 bg-gray-50"
                disabled={editingMascota}
              >
                <Text className="text-center font-medium text-gray-600">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onSubmit}
                className="flex-1 py-3 px-4 rounded-lg bg-blue-500 flex-row items-center justify-center"
                disabled={editingMascota}
              >
                {editingMascota ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-center font-medium text-white">
                    Guardar cambios
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
