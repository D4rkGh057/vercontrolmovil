import { create } from 'zustand';
import { Pago } from '../types';
import { pagosService } from '../services/api';

interface PagosState {
  pagos: Pago[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  getPagos: () => Promise<void>;
  getPagosByUsuario: (userId: string) => Promise<void>;
  updatePago: (pagoId: string, data: Partial<Pago>) => Promise<void>;
  marcarComoPagado: (pagoId: string, metodoPago: string, comprobante?: string) => Promise<void>;
  clearError: () => void;
  setPagos: (pagos: Pago[]) => void;
}

export const usePagosStore = create<PagosState>((set, get) => ({
  pagos: [],
  loading: false,
  error: null,

  getPagos: async () => {
    set({ loading: true, error: null });
    try {
      console.log('🔍 Obteniendo todos los pagos...');
      const response = await pagosService.getPagos();
      
      if (response.data) {
        console.log('✅ Pagos obtenidos:', response.data.length);
        set({ pagos: response.data, loading: false });
      } else {
        console.log('⚠️ No se encontraron pagos');
        set({ pagos: [], loading: false });
      }
    } catch (error: any) {
      console.error('❌ Error al obtener pagos:', error);
      set({ 
        error: error.response?.data?.message ?? 'Error al cargar los pagos',
        loading: false 
      });
    }
  },

  getPagosByUsuario: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      console.log('🔍 Obteniendo pagos del usuario:', userId);
      const response = await pagosService.getPagosByUsuario(userId);
      
      if (response.data) {
        console.log('✅ Pagos del usuario obtenidos:', response.data.length);
        set({ pagos: response.data, loading: false });
      } else {
        console.log('⚠️ No se encontraron pagos para este usuario');
        set({ pagos: [], loading: false });
      }
    } catch (error: any) {
      console.error('❌ Error al obtener pagos del usuario:', error);
      set({ 
        error: error.response?.data?.message ?? 'Error al cargar los pagos',
        loading: false 
      });
    }
  },

  updatePago: async (pagoId: string, data: Partial<Pago>) => {
    set({ loading: true, error: null });
    try {
      console.log('🔄 Actualizando pago:', pagoId, data);
      
      const response = await pagosService.updatePago(pagoId, data);

      if (response.data) {
        const pagos = get().pagos;
        const updatedPagos = pagos.map(pago => {
          const pagoId_actual = pago.id_pago ?? pago.id_factura;
          const pagoId_buscar = pagoId;
          
          return pagoId_actual === pagoId_buscar 
            ? { ...pago, ...response.data, ...data }
            : pago;
        });
        
        set({ pagos: updatedPagos, loading: false });
        console.log('✅ Pago actualizado exitosamente');
      }
    } catch (error: any) {
      console.error('❌ Error al actualizar pago:', error);
      set({ 
        error: error.response?.data?.message ?? 'Error al actualizar el pago',
        loading: false 
      });
    }
  },

  marcarComoPagado: async (pagoId: string, metodoPago: string, comprobante?: string) => {
    set({ loading: true, error: null });
    try {
      console.log('💳 Marcando pago como pagado:', pagoId);
      
      const response = await pagosService.marcarComoPagado(pagoId, {
        metodo_pago: metodoPago,
        comprobante_url: comprobante,
        fecha_pago: new Date().toISOString()
      });

      if (response.data) {
        const pagos = get().pagos;
        const updatedPagos = pagos.map(pago => {
          const pagoId_actual = pago.id_pago ?? pago.id_factura;
          const pagoId_buscar = pagoId;
          
          return pagoId_actual === pagoId_buscar 
            ? { ...pago, ...response.data, estado: 'Pagado' as const }
            : pago;
        });
        
        set({ pagos: updatedPagos, loading: false });
        console.log('✅ Pago marcado como pagado exitosamente');
      }
    } catch (error: any) {
      console.error('❌ Error al marcar pago como pagado:', error);
      set({ 
        error: error.response?.data?.message ?? 'Error al procesar el pago',
        loading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
  
  setPagos: (pagos: Pago[]) => set({ pagos })
}));
