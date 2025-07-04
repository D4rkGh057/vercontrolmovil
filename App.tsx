import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useAuthStore } from './stores/authStore';
import { STRIPE_CONFIG } from './constants/stripe';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MascotasScreen } from './screens/MascotasScreen';
import { CitasScreen } from './screens/CitasScreen';
import { RecordatoriosScreen } from './screens/RecordatoriosScreen';
import { PagosScreen } from './screens/PagosScreen';
import { PerfilScreen } from './screens/PerfilScreen';
import { TabIcon } from './components/TabIcon';
import { 
  Home, 
  Calendar, 
  Bell, 
  User, 
  Heart,
  CreditCard
} from 'lucide-react-native';
import './global.css';

const Tab = createBottomTabNavigator();

const AppContent = () => {
  const { isLoggedIn, isLoading, checkAuthState } = useAuthStore();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);
  
  // Inicializar sistema de notificaciones
  useEffect(() => {
    const initApp = async () => {
      try {
        // Importar de forma dinámica para evitar ciclos de dependencia
        const { initNotifications } = require('./utils/notifications');
        await initNotifications();
        console.log('✅ Sistema de notificaciones inicializado en App.tsx');
      } catch (error) {
        console.error('❌ Error al inicializar notificaciones:', error);
      }
    };
    
    initApp();
  }, []);

  // Configurar listener de notificaciones
  useEffect(() => {
    console.log('🔊 Configurando listeners de notificaciones...');
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Notificación recibida:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Usuario tocó notificación:', response);
      const data = response.notification.request.content.data;
      
      if (data?.type === 'recordatorio' && data?.recordatorioId) {
        // Aquí podrías navegar a la pantalla de recordatorios específico
        console.log('🔔 Recordatorio ID:', data.recordatorioId);
      }
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

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
          name="Pagos" 
          component={PagosScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} IconComponent={CreditCard} />
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
      <StripeProvider
        publishableKey={STRIPE_CONFIG.PUBLISHABLE_KEY}
        merchantIdentifier="merchant.com.vetcontrol"
      >
        <AppContent />
      </StripeProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
