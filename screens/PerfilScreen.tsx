import React, { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Container } from '../components/Container';
import { EditProfileModal } from '../components/EditProfileModal';
import { useAuthStore } from '../stores/authStore';
import { useMascotasStore } from '../stores/mascotasStore';
import { requestNotificationPermissions } from '../utils/notifications'; // Importar la función de permisos
import {
  User,
  Settings,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Phone,
  MapPinHouse,
  Bell
} from 'lucide-react-native';

export const PerfilScreen = () => {
  const { user, logout, updateProfile } = useAuthStore();
  const { mascotas, getMascotasByDueño } = useMascotasStore();
  const [showEditModal, setShowEditModal] = useState(false);

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
    setShowEditModal(true);
  };

  const handleSettings = () => {
    Alert.alert('Configuración', 'Funcionalidad próximamente disponible');
  };

  const handleHelp = () => {
    Alert.alert('Ayuda', 'Para soporte técnico, contacta a: soporte@vetcontrol.com');
  };

  const handleUpdateProfile = async (userData: any) => {
    await updateProfile(userData);
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermissions();
    if (granted) {
      Alert.alert('Notificaciones habilitadas', 'Ahora recibirás recordatorios y notificaciones importantes.');
    } else {
      Alert.alert('Permiso denegado', 'No se pudieron habilitar las notificaciones.');
    }
  };

  const debugUser = () => {
    console.log('🔍 Datos del usuario actual:', JSON.stringify(user, null, 2));
    Alert.alert('Debug', `Usuario: ${JSON.stringify(user, null, 2)}`);
  };

  const debugMascotas = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'No hay usuario logueado');
      return;
    }
    
    try {
      console.log('🐕 Cargando mascotas del usuario:', user.id);
      await getMascotasByDueño(user.id);
      console.log('🐕 Mascotas cargadas:', JSON.stringify(mascotas, null, 2));
      Alert.alert('Debug Mascotas', `Mascotas encontradas: ${mascotas.length}\n${mascotas.map(m => m.nombre).join(', ')}`);
    } catch (error) {
      console.error('❌ Error cargando mascotas:', error);
      Alert.alert('Error', 'No se pudieron cargar las mascotas');
    }
  };

  return (
    <Container>
      <ScrollView className="flex-1">
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
            <Text className="text-gray-600 mb-1">{user?.email}</Text>
            {user?.telefono && (
              <View className="flex-row items-center gap-1">
                <Phone size={15} color="#6B7280" />
                <Text className="text-gray-600 mb-1">{user.telefono}</Text>
              </View>
            )}
            {user?.direccion && (
              <View className="flex-row items-center gap-1">
                <MapPinHouse size={15} color="#6B7280" />
                <Text className="text-gray-600 text-center">{user.direccion}</Text>
              </View>
            )}
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
            onPress={handleEnableNotifications} // Botón para habilitar notificaciones
          >
            <View className="mr-4">
              <Bell size={24} color="#6B7280" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-medium text-gray-800">Habilitar Notificaciones</Text>
              <Text className="text-sm text-gray-600">Recibe recordatorios y alertas importantes</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

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
          <Text className="text-center text-gray-500 text-xs mb-3">
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

      {/* Edit Profile Modal */}
      {user && (
        <EditProfileModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={user}
          onSave={handleUpdateProfile}
        />
      )}
    </Container>
  );
};
