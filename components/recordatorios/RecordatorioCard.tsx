import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Recordatorio } from '../../types';
import {
    Syringe,
    Pill,
    Bug,
    Calendar,
    AlertTriangle,
    CheckCircle,
    Check,
    X
} from 'lucide-react-native';

interface RecordatorioCardProps {
    recordatorio: Recordatorio;
    onToggleComplete: (id: string, completado: boolean) => void;
    onDelete: (id: string) => void;
}

export const RecordatorioCard: React.FC<RecordatorioCardProps> = ({
    recordatorio,
    onToggleComplete,
    onDelete
}) => {
    const getRecordatorioIcon = (tipo: string) => {
        const iconProps = { size: 24, color: '#6B7280' };

        switch (tipo) {
            case 'vacuna': return <Syringe {...iconProps} />;
            case 'medicamento': return <Pill {...iconProps} />;
            case 'desparasitación': return <Bug {...iconProps} />;
            default: return <Calendar {...iconProps} />;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDaysUntilDue = (fecha: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(fecha);
        dueDate.setHours(0, 0, 0, 0);
        const diffTime = dueDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getPriorityBadgeColor = (tipo: string) => {
        switch (tipo.toLowerCase()) {
            case 'vacuna': return 'bg-red-100 text-red-800';
            case 'medicamento': return 'bg-yellow-100 text-yellow-800';
            case 'desparasitación': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityText = (tipo: string) => {
        switch (tipo) {
            case 'vacuna': return 'Alta';
            case 'medicamento': return 'Media';
            default: return 'Baja';
        }
    };

    const isOverdue = (fecha: string) => {
        const today = new Date();
        const recordatorioDate = new Date(fecha);
        return recordatorioDate < today;
    };

    const handleRecordatorioPress = () => {
        const overdueText = isOverdue(recordatorio.fecha_programada) && !recordatorio.completado ? '\n⚠️ VENCIDO' : '';
        const recordatorioDetails = `Mascota: ${recordatorio.id_mascota?.nombre ?? 'N/A'}\nTipo: ${recordatorio.tipo}\nTítulo: ${recordatorio.titulo}\nDescripción: ${recordatorio.descripcion}\nFecha programada: ${formatDate(recordatorio.fecha_programada)}\nEstado: ${recordatorio.completado ? 'Completado' : 'Pendiente'}${overdueText}`;

        const alertButtons: Array<{ text: string; style?: 'default' | 'cancel' | 'destructive'; onPress?: () => void }> = [
            { text: 'Cerrar', style: 'cancel' }
        ];

        if (!recordatorio.completado) {
            alertButtons.push({
                text: 'Marcar como Completado',
                onPress: () => {
                    onToggleComplete(recordatorio.id_recordatorio, true);
                }
            });
        }

        Alert.alert(
            'Detalle del Recordatorio',
            recordatorioDetails,
            alertButtons
        );
    };

    const daysUntil = getDaysUntilDue(recordatorio.fecha_programada);
    const isOverdueRecord = daysUntil < 0 && !recordatorio.completado;
    const isDueSoon = daysUntil <= 3 && daysUntil >= 0 && !recordatorio.completado;

    const getCardStyle = () => {
        if (recordatorio.completado) return "border-green-200 bg-green-50";
        if (isOverdueRecord) return "border-red-200 bg-red-50";
        if (isDueSoon) return "border-yellow-200 bg-yellow-50";
        return "border-gray-200 bg-white";
    };

    const getIconBgStyle = () => {
        if (recordatorio.completado) return "bg-green-100";
        if (isOverdueRecord) return "bg-red-100";
        if (isDueSoon) return "bg-yellow-100";
        return "bg-gray-100";
    };

    const getStatusTextStyle = () => {
        if (recordatorio.completado) return "text-green-600";
        if (isOverdueRecord) return "text-red-600";
        if (isDueSoon) return "text-yellow-600";
        return "text-gray-600";
    };

    const getStatusText = () => {
        if (recordatorio.completado) return "Completado";
        if (isOverdueRecord) return `Vencido hace ${Math.abs(daysUntil)} días`;
        if (daysUntil === 0) return "Vence hoy";
        if (daysUntil === 1) return "Vence mañana";
        return `Vence en ${daysUntil} días`;
    };

    return (
        <TouchableOpacity
            onPress={handleRecordatorioPress}
            className={`rounded-xl p-4 border-2 mx-2 ${getCardStyle()}`}
        >
            {/* Header */}
            <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-center flex-1">
                    <View className={`p-2 rounded-full mr-3 ${getIconBgStyle()}`}>
                        {getRecordatorioIcon(recordatorio.tipo)}
                    </View>
                    <View className="flex-1">
                        <Text className="font-bold text-gray-800 text-base">
                            {recordatorio.titulo}
                        </Text>
                        <Text className="text-sm text-gray-600 capitalize">
                            {recordatorio.tipo} • {recordatorio.id_mascota?.nombre ?? 'Mascota'}
                        </Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-2">
                    <View className={`px-2 py-1 rounded-full ${getPriorityBadgeColor(recordatorio.tipo)}`}>
                        <Text className="text-xs font-semibold">
                            {getPriorityText(recordatorio.tipo)}
                        </Text>
                    </View>
                    {isOverdueRecord && <AlertTriangle size={16} color="#EF4444" />}
                    {recordatorio.completado && <CheckCircle size={16} color="#10B981" />}
                </View>
            </View>

            {/* Description */}
            {recordatorio.descripcion ? (
                <Text className="text-sm text-gray-600 mb-3">
                    {recordatorio.descripcion}
                </Text>
            ) : null}

            {/* Date and Status */}
            <View className="flex-row items-center justify-between text-sm mb-4">
                <View className="flex-row items-center">
                    <Calendar size={16} color="#6B7280" />
                    <Text className="text-gray-600 ml-2">
                        {formatDate(recordatorio.fecha_programada)}
                    </Text>
                </View>
                <Text className={`font-semibold ${getStatusTextStyle()}`}>
                    {getStatusText()}
                </Text>
            </View>

            {/* Action Buttons */}
            {!recordatorio.completado && (
                <View className="flex-row gap-2">
                    <TouchableOpacity
                        className="flex-1 bg-[#003637] px-4 py-2 rounded-lg flex-row items-center justify-center"
                        onPress={() => onToggleComplete(recordatorio.id_recordatorio, true)}
                    >
                        <Check size={16} color="white" />
                        <Text className="text-white font-semibold ml-2 text-sm">
                            Marcar Completado
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-neutral-50 border-gray-950 px-4 py-2 rounded-lg flex-row items-center justify-center"
                        onPress={() => onDelete(recordatorio.id_recordatorio)}
                    >
                        <Text className="text-neutral-900 font-semibold ml-1 text-sm">
                            Eliminar
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Completed state button */}
            {recordatorio.completado && (
                <TouchableOpacity
                    className="bg-gray-200 px-4 py-2 rounded-lg flex-row items-center justify-center"
                    onPress={() => onDelete(recordatorio.id_recordatorio)}
                >
                    <X size={16} color="#6B7280" />
                    <Text className="text-gray-700 font-semibold ml-2 text-sm">
                        Eliminar
                    </Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};
