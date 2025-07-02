import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';

const BASE_URL = 'http://192.168.1.13:3000'; // Para emulador Android, cambia por tu IP si usas dispositivo físico

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log de la petición
    logger.apiRequest(
      config.method || 'unknown', 
      config.url || 'unknown', 
      config.data
    );
  } catch (error) {
    console.error('Error getting token from storage:', error);
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    // Log de respuesta exitosa
    logger.apiResponse(
      response.config.method || 'unknown',
      response.config.url || 'unknown',
      response.status,
      response.data
    );
    return response;
  },
  async (error) => {
    // Log de error en API
    logger.apiError(
      error.config?.method || 'unknown',
      error.config?.url || 'unknown',
      error
    );

    if (error.response?.status === 401) {
      // Token expirado o inválido
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        // Importar dinámicamente el store para evitar dependencias circulares
        const { useAuthStore } = await import('../stores/authStore');
        const logout = useAuthStore.getState().logout;
        await logout();
      } catch (storageError) {
        console.error('Error clearing auth data:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (userData: any) => 
    api.post('/auth/register', userData),
};

export const mascotasService = {
  getMascotas: () => api.get('/mascotas'),
  getMascota: (id: string) => api.get(`/mascotas/${id}`),
  createMascota: (data: any) => api.post('/mascotas', data),
  updateMascota: (id: string, data: any) => api.put(`/mascotas/${id}`, data),
  patchMascota: (id: string, data: any) => api.patch(`/mascotas/${id}`, data),
  deleteMascota: (id: string) => api.delete(`/mascotas/${id}`),
};

export const citasService = {
  getCitas: () => api.get('/citas'),
  getCita: (id: string) => api.get(`/citas/${id}`),
  createCita: (data: any) => api.post('/citas', data),
  updateCita: (id: string, data: any) => api.put(`/citas/${id}`, data),
  deleteCita: (id: string) => api.delete(`/citas/${id}`),
};

export const historialesService = {
  getHistoriales: () => api.get('/historiales_medicos'),
  getHistorial: (id: string) => api.get(`/historiales_medicos/${id}`),
  getHistorialByMascota: (mascotaId: string) => 
    api.get(`/historiales_medicos/mascota/${mascotaId}`),
};

export const recordatoriosService = {
  getRecordatorios: () => api.get('/recordatorios'),
  createRecordatorio: (data: any) => api.post('/recordatorios', data),
  updateRecordatorio: (id: string, data: any) => api.put(`/recordatorios/${id}`, data),
  deleteRecordatorio: (id: string) => api.delete(`/recordatorios/${id}`),
};

export const usuariosService = {
  getUsuario: (id: string) => api.get(`/usuarios/${id}`),
  updateUsuario: (id: string, data: any) => api.patch(`/usuarios/${id}`, data),
};
