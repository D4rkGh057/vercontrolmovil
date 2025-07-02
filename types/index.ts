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
  id_usuario: string;
  nombre: string;
  apellido: string;
  email: string;
  contraseña: string;
  rol: string;
  telefono?: string;
  direccion?: string;
}

export interface Cita {
  id_cita: string;
  fecha_hora: string;
  motivo: string;
  estado: 'Programada' | 'Completada' | 'Cancelada';
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
  id_usuario: string;
  nombre: string;
  apellido: string;
    email: string;
  contraseña: string;
  rol: string;
}
