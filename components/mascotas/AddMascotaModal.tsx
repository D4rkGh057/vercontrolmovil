import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Dog, Cat, X } from 'lucide-react-native';

interface MascotaForm {
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  fecha_nacimiento: string;
  color: string;
}

interface AddMascotaModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  addingMascota: boolean;
  mascotaForm: MascotaForm;
  updateFormField: (field: keyof MascotaForm, value: string) => void;
}

export const AddMascotaModal: React.FC<AddMascotaModalProps> = ({
  visible,
  onClose,
  onSubmit,
  addingMascota,
  mascotaForm,
  updateFormField
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    presentationStyle="pageSheet"
    onRequestClose={onClose}
  >
    <View className="flex-1 bg-white">
      {/* Header del modal */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">Agregar Mascota</Text>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1 p-4">
        {/* Nombre */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Nombre *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2 text-base"
            value={mascotaForm.nombre}
            onChangeText={(value) => updateFormField('nombre', value)}
            placeholder="Nombre de la mascota"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        {/* Especie */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Especie *</Text>
          <View className="flex-row">
            <TouchableOpacity
              className={`flex-1 p-3 rounded-lg mr-2 border ${mascotaForm.especie === 'Perro'
                ? 'bg-blue-50 border-blue-500'
                : 'bg-gray-50 border-gray-300'
                }`}
              onPress={() => updateFormField('especie', 'Perro')}
            >
              <View className="flex-row items-center justify-center">
                <Dog size={20} color={mascotaForm.especie === 'Perro' ? '#3B82F6' : '#6B7280'} />
                <Text className={`ml-2 font-medium ${mascotaForm.especie === 'Perro' ? 'text-blue-600' : 'text-gray-600'
                  }`}>Perro</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 p-3 rounded-lg ml-2 border ${mascotaForm.especie === 'Gato'
                ? 'bg-blue-50 border-blue-500'
                : 'bg-gray-50 border-gray-300'
                }`}
              onPress={() => updateFormField('especie', 'Gato')}
            >
              <View className="flex-row items-center justify-center">
                <Cat size={20} color={mascotaForm.especie === 'Gato' ? '#3B82F6' : '#6B7280'} />
                <Text className={`ml-2 font-medium ${mascotaForm.especie === 'Gato' ? 'text-blue-600' : 'text-gray-600'
                  }`}>Gato</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* Raza */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Raza *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2 text-base"
            value={mascotaForm.raza}
            onChangeText={(value) => updateFormField('raza', value)}
            placeholder="Ej: Labrador, Persa, Mestizo"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        {/* Sexo */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Sexo *</Text>
          <View className="flex-row">
            <TouchableOpacity
              className={`flex-1 p-3 rounded-lg mr-2 border ${mascotaForm.sexo === 'Macho'
                ? 'bg-blue-50 border-blue-500'
                : 'bg-gray-50 border-gray-300'
                }`}
              onPress={() => updateFormField('sexo', 'Macho')}
            >
              <Text className={`text-center font-medium ${mascotaForm.sexo === 'Macho' ? 'text-blue-600' : 'text-gray-600'
                }`}>Macho</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 p-3 rounded-lg ml-2 border ${mascotaForm.sexo === 'Hembra'
                ? 'bg-blue-50 border-blue-500'
                : 'bg-gray-50 border-gray-300'
                }`}
              onPress={() => updateFormField('sexo', 'Hembra')}
            >
              <Text className={`text-center font-medium ${mascotaForm.sexo === 'Hembra' ? 'text-blue-600' : 'text-gray-600'
                }`}>Hembra</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Fecha de nacimiento */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2 text-base"
            value={mascotaForm.fecha_nacimiento}
            onChangeText={(value) => updateFormField('fecha_nacimiento', value)}
            placeholder="YYYY-MM-DD (Ej: 2020-05-15)"
            placeholderTextColor="#9CA3AF"
          />
          <Text className="text-xs text-gray-500 mt-1">Formato: Año-Mes-Día</Text>
        </View>
        {/* Color */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Color *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2 text-base"
            value={mascotaForm.color}
            onChangeText={(value) => updateFormField('color', value)}
            placeholder="Ej: Marrón, Negro, Blanco, Tricolor"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </ScrollView>
      {/* Botones de acción */}
      <View className="p-4 border-t border-gray-200">
        <View className="flex-row">
          <TouchableOpacity
            className="flex-1 bg-gray-200 py-3 rounded-lg mr-2"
            onPress={onClose}
            disabled={addingMascota}
          >
            <Text className="text-center font-medium text-gray-700">Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg ml-2 ${addingMascota ? 'bg-gray-400' : 'bg-blue-500'}`}
            onPress={onSubmit}
            disabled={addingMascota}
          >
            {addingMascota ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center font-medium text-white">Agregar Mascota</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);
