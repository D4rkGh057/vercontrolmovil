import React from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Container } from '../components/Container';
import { useAuthStore } from '../stores/authStore';
import { 
  User, 
  Settings, 
  HelpCircle, 
  Info, 
  LogOut,
  ChevronRight 
} from 'lucide-react-native';

export const PerfilScreen = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar sesión', 
          style: 'destructive',
          onPress: () => {
            logout().catch(console.error);
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Editar Perfil', 'Funcionalidad próximamente disponible');
  };

  const handleSettings = () => {
    Alert.alert('Configuración', 'Funcionalidad próximamente disponible');
  };

  const handleHelp = () => {
    Alert.alert('Ayuda', 'Para soporte técnico, contacta a: soporte@vetcontrol.com');
  };

  return (
    <Container>
      <ScrollView className="flex-1 mt-10">
        <Text className="text-2xl font-bold text-center mb-6 text-gray-800">
          Mi Perfil
        </Text>

        {/* User Info Card */}
        <View className="bg-white rounded-lg p-6 mb-4 shadow-sm border border-gray-200">
          <View className="items-center mb-4">
            <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-3">
              <User size={32} color="white" />
            </View>
            <Text className="text-xl font-bold text-gray-800">
              {user?.nombre} {user?.apellido}
            </Text>
            <Text className="text-gray-600">{user?.email}</Text>
          </View>

          <TouchableOpacity 
            className="bg-blue-500 py-3 rounded-lg"
            onPress={handleEditProfile}
          >
            <Text className="text-white font-semibold text-center">
              Editar Perfil
            </Text>
          </TouchableOpacity>
        </View>

        {/* Menu Options */}
        <View className="bg-white rounded-lg mb-4 shadow-sm border border-gray-200">
          <TouchableOpacity 
            className="flex-row items-center p-4 border-b border-gray-100"
            onPress={handleSettings}
          >
            <View className="mr-4">
              <Settings size={24} color="#6B7280" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-medium text-gray-800">Configuración</Text>
              <Text className="text-sm text-gray-600">Notificaciones, privacidad</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center p-4 border-b border-gray-100"
            onPress={handleHelp}
          >
            <View className="mr-4">
              <HelpCircle size={24} color="#6B7280" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-medium text-gray-800">Ayuda y Soporte</Text>
              <Text className="text-sm text-gray-600">Preguntas frecuentes, contacto</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center p-4"
            onPress={() => Alert.alert('Acerca de', 'VetControl Mobile v1.0.0\nDesarrollado por SoftwareSquad !404')}
          >
            <View className="mr-4">
              <Info size={24} color="#6B7280" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-medium text-gray-800">Acerca de</Text>
              <Text className="text-sm text-gray-600">Versión e información</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <Text className="text-center text-gray-600 text-sm mb-2">
            VetControl Mobile
          </Text>
          <Text className="text-center text-gray-500 text-xs">
            Versión 1.0.0 • Build 2025.01
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          className="bg-red-500 py-4 rounded-lg mb-6 flex-row items-center justify-center"
          onPress={handleLogout}
        >
          <LogOut size={16} color="white" />
          <Text className="text-white font-semibold text-lg ml-2">
            Cerrar Sesión
          </Text>
        </TouchableOpacity>

        {/* Safety padding for bottom navigation */}
        <View className="h-4" />
      </ScrollView>
    </Container>
  );
};
