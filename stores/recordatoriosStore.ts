import { create } from 'zustand';
import { Recordatorio } from '../types';
import { recordatoriosService } from '../services/api';
import { logger } from '../services/logger';

interface RecordatoriosState {
  // Estado
  recordatorios: Recordatorio[];
  loading: boolean;
  error: string | null;

  // Acciones
  getRecordatorios: () => Promise<void>;
  addRecordatorio: (recordatorioData: Partial<Recordatorio>) => Promise<void>;
  updateRecordatorio: (id: string, recordatorioData: Partial<Recordatorio>) => Promise<void>;
  deleteRecordatorio: (id: string) => Promise<void>;
  toggleComplete: (id: string, completado: boolean) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useRecordatoriosStore = create<RecordatoriosState>((set, get) => ({
  // Estado inicial
  recordatorios: [],
  loading: false,
  error: null,

  // Acciones
  getRecordatorios: async () => {
    try {
      set({ loading: true, error: null });
      logger.info('🔔 Cargando recordatorios...');
      
      const response = await recordatoriosService.getRecordatorios();
      
      set({ recordatorios: response.data, loading: false });
      logger.info('✅ Recordatorios cargados exitosamente:', response.data.length);
    } catch (error: any) {
      logger.error('❌ Error cargando recordatorios:', error);
      set({ 
        error: error.response?.data?.message ?? 'Error al cargar los recordatorios',
        loading: false 
      });
    }
  },

  addRecordatorio: async (recordatorioData: Partial<Recordatorio>) => {
    try {
      set({ loading: true, error: null });
      logger.info('🔔 Agregando nuevo recordatorio:', recordatorioData);
      
      const response = await recordatoriosService.createRecordatorio(recordatorioData);
      const { recordatorios } = get();
      
      set({ 
        recordatorios: [...recordatorios, response.data],
        loading: false 
      });
      logger.info('✅ Recordatorio agregado exitosamente:', response.data.id_recordatorio);
    } catch (error: any) {
      logger.error('❌ Error agregando recordatorio:', error);
      set({ 
        error: error.response?.data?.message ?? 'Error al agregar el recordatorio',
        loading: false 
      });
      throw error;
    }
  },

  updateRecordatorio: async (id: string, recordatorioData: Partial<Recordatorio>) => {
    try {
      set({ loading: true, error: null });
      logger.info('🔔 Actualizando recordatorio:', { id, recordatorioData });
      
      const response = await recordatoriosService.updateRecordatorio(id, recordatorioData);
      const { recordatorios } = get();
      
      set({ 
        recordatorios: recordatorios.map(recordatorio => 
          recordatorio.id_recordatorio === id ? { ...recordatorio, ...response.data } : recordatorio
        ),
        loading: false 
      });
      logger.info('✅ Recordatorio actualizado exitosamente:', id);
    } catch (error: any) {
      logger.error('❌ Error actualizando recordatorio:', error);
      set({ 
        error: error.response?.data?.message ?? 'Error al actualizar el recordatorio',
        loading: false 
      });
      throw error;
    }
  },

  deleteRecordatorio: async (id: string) => {
    try {
      set({ loading: true, error: null });
      logger.info('🔔 Eliminando recordatorio:', id);
      
      await recordatoriosService.deleteRecordatorio(id);
      const { recordatorios } = get();
      
      set({ 
        recordatorios: recordatorios.filter(recordatorio => recordatorio.id_recordatorio !== id),
        loading: false 
      });
      logger.info('✅ Recordatorio eliminado exitosamente:', id);
    } catch (error: any) {
      logger.error('❌ Error eliminando recordatorio:', error);
      set({ 
        error: error.response?.data?.message ?? 'Error al eliminar el recordatorio',
        loading: false 
      });
      throw error;
    }
  },

  toggleComplete: async (id: string, completado: boolean) => {
    try {
      logger.info('🔔 Marcando recordatorio como completado/pendiente:', { id, completado });
      
      await recordatoriosService.updateRecordatorio(id, { completado });
      const { recordatorios } = get();
      
      set({ 
        recordatorios: recordatorios.map(recordatorio => 
          recordatorio.id_recordatorio === id ? { ...recordatorio, completado } : recordatorio
        )
      });
      logger.info('✅ Estado del recordatorio actualizado exitosamente:', id);
    } catch (error: any) {
      logger.error('❌ Error actualizando estado del recordatorio:', error);
      set({ 
        error: error.response?.data?.message ?? 'Error al actualizar el estado del recordatorio'
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },
}));
