export interface Mascota {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  peso?: number;
  color?: string;
  sexo?: string;
  fecha_nacimiento?: string;
  cliente_id: string;
  created_at: string;
  updated_at: string;
}

export interface Cita {
  id: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: 'programada' | 'completada' | 'cancelada';
  mascota_id: string;
  usuario_id: string;
  created_at: string;
  updated_at: string;
  mascota?: Mascota;
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
  id: string;
  tipo: 'vacuna' | 'medicamento' | 'desparasitacion';
  descripcion: string;
  fecha_programada: string;
  completado: boolean;
  mascota_id: string;
  created_at: string;
  updated_at: string;
  mascota?: Mascota;
}

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol: 'cliente' | 'veterinario' | 'admin';
}
