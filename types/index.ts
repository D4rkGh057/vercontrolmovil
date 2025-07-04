export interface ClienteAPI {
  id_cliente: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
}

export interface Mascota {
  id_mascota: string;
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  fecha_nacimiento: string;
  color: string;
  peso_actual: number;
  tamano: string;
  num_microchip_collar: string;
  esterilizado: boolean;
  id_usuario: Usuario;
}

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  contraseña?: string;
  rol: string;
  telefono?: string;
  direccion?: string;
}

export interface Cita {
  id_cita: string;
  fecha_hora: string;
  motivo: string;
  estado: 'Programada' | 'Completada' | 'Cancelada' | 'Pendiente';
  id_mascota: Mascota;
  id_usuario: Usuario;
}

export interface HistorialMedico {
  id: string;
  fecha: string;
  motivo_consulta: string;
  diagnostico: string;
  tratamiento: string;
  observaciones?: string;
  mascota_id: string;
  usuario_id: string;
  created_at: string;
  updated_at: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion?: string;
  created_at: string;
  updated_at: string;
}

export interface Recordatorio {
  id_recordatorio: string;
  tipo: 'vacuna' | 'medicamento' | 'desparasitacion';
  titulo: string;
  descripcion: string;
  fecha_programada: string;
  completado: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  id_mascota: Mascota;
  notification_id?: string; // ID de la notificación programada
}

// Interfaces para facturas
export interface Invoice {
  fecha_emision: string;
  total: number;
  metodo_pago: string;
  id_cliente: string;
  id_empresa: string;
  estado?: string;
}

export interface InvoiceDetail {
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  id_factura: { id_factura: number };
  id_lote?: { id_lote: number };
}

export interface Pago {
  id_pago?: string;
  id_factura?: string; // Para compatibilidad con el modelo de facturas
  concepto?: string;
  descripcion?: string;
  monto?: number;
  total?: number; // Para compatibilidad con el modelo de facturas
  fecha_emision: string;
  fecha_vencimiento: string;
  fecha_pago?: string;
  estado: 'pagado' | 'pendiente' | 'anulado' | 'vencido';
  metodo_pago?: 'Efectivo' | 'Tarjeta' | 'Transferencia' | 'Stripe' | 'Otro';
  id_mascota?: Mascota;
  id_usuario?: Usuario;
  id_cliente?: string; // Para compatibilidad con el modelo de facturas
  id_empresa?: string; // Para compatibilidad con el modelo de facturas
  comprobante_url?: string;
}

// Tipos para Stripe
export interface StripePaymentData {
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'processing' | 'requires_payment_method' | 'canceled';
  created: number;
  description?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
  data?: StripePaymentData;
}
