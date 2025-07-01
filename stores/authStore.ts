import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../types';
import { authService } from '../services/api';
import { logger } from '../services/logger';

interface AuthState {
  // Estado
  user: Usuario | null;
  token: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  
  // Acciones
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthState: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol?: string;
}

// Función auxiliar para decodificar JWT
const decodeJWT = (token: string) => {
  try {
    const payload = token.split('.')[1];
    
    // Función para decodificar base64 URL-safe
    const base64UrlDecode = (str: string) => {
      // Convertir de base64url a base64 estándar
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      // Agregar padding si es necesario
      while (base64.length % 4) {
        base64 += '=';
      }
      return atob(base64);
    };
    
    return JSON.parse(base64UrlDecode(payload));
  } catch (error) {
    logger.error('❌ Error decodificando JWT', error);
    return null;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      isLoading: true,
      isLoggedIn: false,

      // Acciones
      login: async (email: string, password: string) => {
        try {
          logger.loginAttempt(email);
          set({ isLoading: true });
          
          const response = await authService.login(email, password);
          
          if (response.data.access_token) {
            const { access_token } = response.data;
            let user = response.data.user; // Podría estar o no
            
            logger.info('🔑 Token recibido del servidor', {
              tokenLength: access_token.length,
              tokenPreview: access_token.substring(0, 20) + '...',
              hasUserData: !!user
            });
            
            // Si no hay datos del usuario en la respuesta, intentar decodificar el JWT
            if (!user) {
              try {
                logger.info('🔓 Intentando decodificar JWT para obtener datos del usuario');
                
                // Decodificar JWT (solo el payload, sin verificar la firma por seguridad)
                const payload = access_token.split('.')[1];
                
                // Función para decodificar base64 URL-safe
                const base64UrlDecode = (str: string) => {
                  // Convertir de base64url a base64 estándar
                  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
                  // Agregar padding si es necesario
                  while (base64.length % 4) {
                    base64 += '=';
                  }
                  return atob(base64);
                };
                
                const decodedPayload = JSON.parse(base64UrlDecode(payload));
                
                logger.info('� Payload del JWT decodificado', decodedPayload);
                
                // Crear objeto usuario a partir del JWT
                user = {
                  id: decodedPayload.sub || decodedPayload.userId || decodedPayload.id,
                  email: email, // Usamos el email del formulario
                  nombre: decodedPayload.username || decodedPayload.nombre || 'Usuario',
                  apellido: decodedPayload.apellido || '',
                  rol: decodedPayload.rol || decodedPayload.role || 'cliente',
                  telefono: decodedPayload.telefono || ''
                };
                
                logger.info('�👤 Datos del usuario creados desde JWT', user);
              } catch (jwtError) {
                logger.error('❌ Error decodificando JWT', jwtError);
                
                // Como último recurso, crear un usuario básico
                user = {
                  id: 'temp_' + Date.now(),
                  email: email,
                  nombre: 'Usuario',
                  apellido: '',
                  rol: 'cliente',
                  telefono: ''
                };
                
                logger.info('👤 Datos del usuario creados por defecto', user);
              }
            } else {
              logger.info('👤 Datos del usuario recibidos del servidor', {
                userId: user.id,
                email: user.email,
                nombre: user.nombre,
                apellido: user.apellido,
                rol: user.rol
              });
            }
            
            // Guardar en AsyncStorage
            await AsyncStorage.setItem('token', access_token);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            
            logger.info('💾 Datos guardados en AsyncStorage');
            
            // Actualizar estado
            set({
              token: access_token,
              user: user,
              isLoggedIn: true,
              isLoading: false,
            });
            
            logger.loginSuccess(user);
          } else {
            logger.error('❌ Respuesta de login inválida - no hay access_token', response.data);
            throw new Error('Respuesta de login inválida - no se recibió token de acceso');
          }
        } catch (error: any) {
          set({ isLoading: false });
          logger.loginError(error, email);
          console.error('Login error:', error);
          throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
        }
      },

      register: async (userData: RegisterData) => {
        try {
          logger.registerAttempt(userData);
          set({ isLoading: true });
          
          const registerPayload = {
            ...userData,
            rol: userData.rol || 'cliente'
          };
          
          logger.info('📤 Enviando datos de registro', registerPayload);
          
          await authService.register(registerPayload);
          
          logger.registerSuccess();
          set({ isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          logger.registerError(error, userData.email);
          console.error('Register error:', error);
          throw new Error(error.response?.data?.message || 'Error al registrarse');
        }
      },

      logout: async () => {
        try {
          // Limpiar AsyncStorage
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          
          // Resetear estado
          set({
            user: null,
            token: null,
            isLoggedIn: false,
            isLoading: false,
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      checkAuthState: async () => {
        try {
          set({ isLoading: true });
          
          logger.debug('🔍 Verificando estado de autenticación');
          
          const storedToken = await AsyncStorage.getItem('token');
          const storedUser = await AsyncStorage.getItem('user');
          
          logger.debug('💾 Datos en AsyncStorage', {
            hasToken: !!storedToken,
            hasUser: !!storedUser,
            tokenPreview: storedToken ? storedToken.substring(0, 20) + '...' : null
          });
          
          if (storedToken && storedUser) {
            const user = JSON.parse(storedUser);
            
            logger.info('✅ Usuario autenticado encontrado', {
              userId: user.id,
              email: user.email,
              nombre: user.nombre
            });
            
            set({
              token: storedToken,
              user: user,
              isLoggedIn: true,
              isLoading: false,
            });
          } else {
            logger.info('❌ No hay usuario autenticado');
            set({
              user: null,
              token: null,
              isLoggedIn: false,
              isLoading: false,
            });
          }
        } catch (error) {
          logger.error('Error checking auth state:', error);
          console.error('Error checking auth state:', error);
          set({
            user: null,
            token: null,
            isLoggedIn: false,
            isLoading: false,
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
