import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from './stores/authStore';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MascotasScreen } from './screens/MascotasScreen';
import { CitasScreen } from './screens/CitasScreen';
import { RecordatoriosScreen } from './screens/RecordatoriosScreen';
import { PerfilScreen } from './screens/PerfilScreen';
import { TabIcon } from './components/TabIcon';
import { 
  Home, 
  Calendar, 
  Bell, 
  User, 
  Heart
} from 'lucide-react-native';
import './global.css';

const Tab = createBottomTabNavigator();

const AppContent = () => {
  const { isLoggedIn, isLoading, checkAuthState } = useAuthStore();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-neutral-50">
        <ActivityIndicator size="large" color="#005456" />
        <Text className="mt-4 text-neutral-600">Cargando...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
            paddingBottom: Math.max(insets.bottom, 5),
            paddingTop: 5,
            height: 60 + Math.max(insets.bottom, 0),
          },
          tabBarActiveTintColor: '#005456',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        <Tab.Screen 
          name="Inicio" 
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} IconComponent={Home} />
            ),
          }}
        />
        <Tab.Screen 
          name="Mascotas" 
          component={MascotasScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} IconComponent={Heart} />
            ),
          }}
        />
        <Tab.Screen 
          name="Citas" 
          component={CitasScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} IconComponent={Calendar} />
            ),
          }}
        />
        <Tab.Screen 
          name="Recordatorios" 
          component={RecordatoriosScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} IconComponent={Bell} />
            ),
          }}
        />
        <Tab.Screen 
          name="Perfil" 
          component={PerfilScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} IconComponent={User} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
