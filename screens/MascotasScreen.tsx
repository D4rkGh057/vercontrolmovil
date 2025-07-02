import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Container } from '../components/Container';
import { Mascota } from '../types';
import { useAuthStore } from '../stores/authStore';
import { useMascotasStore } from '../stores/mascotasStore';
import {
  Plus,
  Activity,
  Slice,
  StethoscopeIcon,
  Syringe,
  Pill,
  HeartPulse,
  ClipboardList,
  ShieldCheck
} from 'lucide-react-native';
import { MascotaCard } from '../components/mascotas/MascotaCard';
import { HistorialMedico } from '../components/mascotas/HistorialMedico';
import { AddMascotaModal } from '../components/mascotas/AddMascotaModal';
import { EditMascotaModal } from '../components/mascotas/EditMascotaModal';

interface HistorialItem {
  id: string;
  tipo: 'vacuna' | 'consulta' | 'cirugia' | 'desparasitacion';
  titulo: string;
  fecha: string;
  veterinario: string;
  notas?: string;
}

interface MascotaForm {
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  fecha_nacimiento: string;
  color: string;
  peso_actual: string;
  tamano: 'Pequeño' | 'Mediano' | 'Grande';
  num_microchip_collar: string;
  esterilizado: boolean;
}

export const MascotasScreen = () => {
  const { user } = useAuthStore();
  const { 
    mascotas, 
    loading, 
    error, 
    getMascotasByDueño, 
    addMascota, 
    updateMascota 
  } = useMascotasStore();
  
  const [expandedMascota, setExpandedMascota] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [addingMascota, setAddingMascota] = useState(false);
  const [editingMascota, setEditingMascota] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null);
  const [mascotaForm, setMascotaForm] = useState<MascotaForm>({
    nombre: '',
    especie: 'Perro',
    raza: '',
    sexo: 'Macho',
    fecha_nacimiento: '',
    color: '',
    peso_actual: '',
    tamano: 'Mediano',
    num_microchip_collar: '',
    esterilizado: false
  });

  // Datos de ejemplo para el historial médico
  const historialMedico: Record<string, HistorialItem[]> = {
    'boby': [
      {
        id: '1',
        tipo: 'vacuna',
        titulo: 'Vacuna antirrábica',
        fecha: '2023-12-01',
        veterinario: 'Dr. García'
      },
      {
        id: '2',
        tipo: 'consulta',
        titulo: 'Revisión general',
        fecha: '2023-11-15',
        veterinario: 'Dr. García'
      }
    ],
    'luna': [
      {
        id: '3',
        tipo: 'vacuna',
        titulo: 'Vacuna triple felina',
        fecha: '2023-11-20',
        veterinario: 'Dr. Martínez'
      },
      {
        id: '4',
        tipo: 'cirugia',
        titulo: 'Esterilización',
        fecha: '2023-10-10',
        veterinario: 'Dr. Martínez'
      }
    ]
  };

  useEffect(() => {
    if (user?.id) {
      getMascotasByDueño(user.id).catch((error) => {
        Alert.alert('Error', 'No se pudieron cargar las mascotas');
        console.error('Error loading mascotas:', error);
      });
    }
  }, [user, getMascotasByDueño]);

  const handleAddMascota = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setMascotaForm({
      nombre: '',
      especie: 'Perro',
      raza: '',
      sexo: 'Macho',
      fecha_nacimiento: '',
      color: '',
      peso_actual: '',
      tamano: 'Mediano',
      num_microchip_collar: '',
      esterilizado: false
    });
  };

  const handleSubmitMascota = async () => {
    // Validar campos requeridos
    if (!mascotaForm.nombre.trim() || !mascotaForm.raza.trim() || !mascotaForm.color.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    // Validar fecha de nacimiento
    if (mascotaForm.fecha_nacimiento) {
      const fechaNac = new Date(mascotaForm.fecha_nacimiento);
      const hoy = new Date();
      if (fechaNac > hoy) {
        Alert.alert('Error', 'La fecha de nacimiento no puede ser futura');
        return;
      }
    }

    setAddingMascota(true);
    try {
      const mascotaData = {
        ...mascotaForm,
        peso_actual: parseFloat(mascotaForm.peso_actual) || 0,
        id_usuario: {
          id_usuario: user?.id ?? 'c2fc1688-0c58-4e21-8c38-b5bdd1680910'
        }
      };

      await addMascota(mascotaData);
      Alert.alert('Éxito', 'Mascota agregada correctamente');
      handleCloseModal();
    } catch (error) {
      console.error('Error adding mascota:', error);
      Alert.alert('Error', 'No se pudo agregar la mascota. Intenta nuevamente.');
    } finally {
      setAddingMascota(false);
    }
  };

  const handleEditMascota = (mascota: Mascota) => {
    // Validar que la mascota tenga todas las propiedades necesarias
    if (!mascota?.nombre || !mascota?.id_mascota) {
      Alert.alert('Error', 'No se pueden editar los datos de esta mascota. Datos incompletos.');
      return;
    }

    setSelectedMascota(mascota);
    
    // Convertir tamano a tipo específico
    const tamanoValue = mascota.tamano === 'Pequeño' || mascota.tamano === 'Mediano' || mascota.tamano === 'Grande' 
      ? mascota.tamano 
      : 'Mediano';
    
    setMascotaForm({
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza,
      sexo: mascota.sexo,
      fecha_nacimiento: mascota.fecha_nacimiento || '',
      color: mascota.color,
      peso_actual: mascota.peso_actual?.toString() ?? '',
      tamano: tamanoValue,
      num_microchip_collar: mascota.num_microchip_collar ?? '',
      esterilizado: mascota.esterilizado ?? false
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedMascota(null);
    setMascotaForm({
      nombre: '',
      especie: 'Perro',
      raza: '',
      sexo: 'Macho',
      fecha_nacimiento: '',
      color: '',
      peso_actual: '',
      tamano: 'Mediano',
      num_microchip_collar: '',
      esterilizado: false
    });
  };

  const validateEditForm = () => {
    if (!mascotaForm.nombre.trim() || !mascotaForm.raza.trim() || !mascotaForm.color.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return false;
    }

    if (mascotaForm.fecha_nacimiento) {
      const fechaNac = new Date(mascotaForm.fecha_nacimiento);
      const hoy = new Date();
      if (fechaNac > hoy) {
        Alert.alert('Error', 'La fecha de nacimiento no puede ser futura');
        return false;
      }
    }

    return true;
  };

  const getChangedFields = (selectedMascota: Mascota) => {
    const changedFields: Partial<MascotaForm> = {};

    if (mascotaForm.nombre !== selectedMascota.nombre) {
      changedFields.nombre = mascotaForm.nombre;
    }
    if (mascotaForm.especie !== selectedMascota.especie) {
      changedFields.especie = mascotaForm.especie;
    }
    if (mascotaForm.raza !== selectedMascota.raza) {
      changedFields.raza = mascotaForm.raza;
    }
    if (mascotaForm.sexo !== selectedMascota.sexo) {
      changedFields.sexo = mascotaForm.sexo;
    }
    if (mascotaForm.fecha_nacimiento !== (selectedMascota.fecha_nacimiento || '')) {
      changedFields.fecha_nacimiento = mascotaForm.fecha_nacimiento || undefined;
    }
    if (mascotaForm.color !== selectedMascota.color) {
      changedFields.color = mascotaForm.color;
    }
    if (mascotaForm.peso_actual !== (selectedMascota.peso_actual?.toString() ?? '')) {
      changedFields.peso_actual = mascotaForm.peso_actual;
    }
    if (mascotaForm.tamano !== (selectedMascota.tamano ?? 'Mediano')) {
      changedFields.tamano = mascotaForm.tamano;
    }
    if (mascotaForm.num_microchip_collar !== (selectedMascota.num_microchip_collar ?? '')) {
      changedFields.num_microchip_collar = mascotaForm.num_microchip_collar;
    }
    if (mascotaForm.esterilizado !== (selectedMascota.esterilizado ?? false)) {
      changedFields.esterilizado = mascotaForm.esterilizado;
    }

    return changedFields;
  };

  const handleSubmitEditMascota = async () => {
    if (!selectedMascota) return;

    if (!validateEditForm()) return;

    setEditingMascota(true);
    try {
      const changedFields = getChangedFields(selectedMascota);

      // Solo actualizar si hay cambios
      if (Object.keys(changedFields).length === 0) {
        Alert.alert('Información', 'No se detectaron cambios para guardar');
        handleCloseEditModal();
        return;
      }

      await updateMascota(selectedMascota.id_mascota, changedFields);
      Alert.alert('Éxito', 'Mascota actualizada correctamente');
      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating mascota:', error);
      Alert.alert('Error', 'No se pudo actualizar la mascota. Intenta nuevamente.');
    } finally {
      setEditingMascota(false);
    }
  };

  const updateFormField = (field: keyof MascotaForm, value: string | boolean) => {
    setMascotaForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleHistorial = (mascotaId: string) => {
    setExpandedMascota(expandedMascota === mascotaId ? null : mascotaId);
  };

  const getHistorialIcon = (tipo: string) => {
    const iconProps = { size: 16, color: '#6B7280' };

    switch (tipo) {
      case 'vacuna':
        return <Syringe {...iconProps} color="#059669" />;
      case 'consulta':
        return <StethoscopeIcon {...iconProps} color="#0284C7" />;
      case 'cirugia':
        return <Slice {...iconProps} color="#DC2626" />;
      case 'medicacion':
        return <Pill {...iconProps} color="#F59E0B" />;
      case 'chequeo':
        return <HeartPulse {...iconProps} color="#8B5CF6" />;
      case 'examen':
        return <ClipboardList {...iconProps} color="#10B981" />;
      case 'desparasitacion':
        return <ShieldCheck {...iconProps} color="#3B82F6" />;
      default:
        return <Activity {...iconProps} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <Container>
        <View className="flex-1 justify-center items-center px-4">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-2 text-gray-600">Cargando mascotas...</Text>
        </View>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-red-500 text-center mb-4">{error}</Text>
          <TouchableOpacity
            className="bg-blue-500 py-2 px-4 rounded-lg"
            onPress={() => user?.id && getMascotasByDueño(user.id)}
          >
            <Text className="text-white font-semibold">Reintentar</Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <View className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mt-10 mb-2">
          <Text className="text-2xl font-bold text-gray-800">Mis Mascotas</Text>
          <TouchableOpacity
            className="bg-primary-500 px-4 py-2 rounded-lg flex-row items-center"
            onPress={handleAddMascota}
          >
            <Plus size={16} color="white" />
            <Text className="text-white font-medium ml-1">Agregar</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-gray-600 mb-6">Gestiona la información de tus mascotas</Text>

        {mascotas.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-xl font-semibold text-gray-700 mb-2">
              No tienes mascotas registradas
            </Text>
            <Text className="text-gray-500 text-center mb-6">
              Agrega tu primera mascota para comenzar a gestionar su cuidado
            </Text>
            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded-lg flex-row items-center"
              onPress={handleAddMascota}
            >
              <Plus size={16} color="white" />
              <Text className="text-white font-semibold ml-2">Agregar Primera Mascota</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {mascotas.map((mascota) => {
              // Validar que la mascota y sus propiedades existan
              if (!mascota?.nombre || !mascota?.id_mascota) {
                console.warn('Mascota con datos incompletos encontrada:', mascota);
                return null;
              }

              const mascotaKey = mascota.nombre.toLowerCase();
              const historial = historialMedico[mascotaKey] || [];
              const isExpanded = expandedMascota === mascota.id_mascota;
              const edad = mascota.fecha_nacimiento
                ? new Date().getFullYear() - new Date(mascota.fecha_nacimiento).getFullYear()
                : 'N/A';
              return (
                <MascotaCard
                  key={mascota.id_mascota}
                  mascota={mascota}
                  edad={edad}
                  onEdit={() => handleEditMascota(mascota)}
                >
                  <HistorialMedico
                    isExpanded={isExpanded}
                    historial={historial}
                    onToggle={() => toggleHistorial(mascota.id_mascota ?? '')}
                    getHistorialIcon={getHistorialIcon}
                    formatDate={formatDate}
                  />
                </MascotaCard>
              );
            })}
            <View className="h-4" />
          </ScrollView>
        )}

        {/* Modal para agregar mascota */}
        <AddMascotaModal
          visible={showAddModal}
          onClose={handleCloseModal}
          onSubmit={handleSubmitMascota}
          addingMascota={addingMascota}
          mascotaForm={mascotaForm}
          updateFormField={updateFormField}
        />
        {/* Modal para editar mascota */}
        <EditMascotaModal
          visible={showEditModal}
          onClose={handleCloseEditModal}
          onSubmit={handleSubmitEditMascota}
          editingMascota={editingMascota}
          mascotaForm={mascotaForm}
          updateFormField={updateFormField}
          originalMascota={selectedMascota}
        />
      </View>
    </Container>
  );
};
