import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Pago } from '../../types';
import {
    CreditCard,
    Clock,
    CheckCircle,
    AlertTriangle,
    XCircle
} from 'lucide-react-native';

interface PagoCardProps {
    pago: Pago;
    onPress?: () => void;
    onMarcarPagado?: () => void;
}

export const PagoCard: React.FC<PagoCardProps> = ({
    pago,
    onPress,
    onMarcarPagado
}) => {
    // Manejar compatibilidad entre formatos de factura y pago
    const concepto = pago.concepto ?? pago.descripcion ?? 'Factura';
    const monto = pago.monto ?? pago.total ?? 0;
    const id = pago.id_pago ?? pago.id_factura;
    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'pagado':
                return 'text-green-600';
            case 'pendiente':
                return 'text-amber-600';
            case 'vencido':
                return 'text-red-600';
            case 'cancelado':
                return 'text-gray-500';
            default:
                return 'text-gray-600';
        }
    };

    const getEstadoIcon = (estado: string) => {
        switch (estado) {
            case 'pagado':
                return CheckCircle;
            case 'pendiente':
                return Clock;
            case 'vencido':
                return AlertTriangle;
            case 'cancelado':
                return XCircle;
            default:
                return Clock;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Number(amount) || 0);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const isVencido = () => {
        if (!pago.fecha_vencimiento) return false; // No puede estar vencido si no tiene fecha de vencimiento
        
        const today = new Date();
        const vencimiento = new Date(pago.fecha_vencimiento);
        return vencimiento < today && pago.estado === 'pendiente';
    };

    const getIconColor = (estado: string) => {
        switch (estado) {
            case 'pagado':
                return '#059669';
            case 'vencido':
                return '#dc2626';
            case 'cancelado':
                return '#6b7280';
            default:
                return '#d97706';
        }
    };

    const estadoFinal = isVencido() ? 'Vencido' : pago.estado;
    const EstadoIcon = getEstadoIcon(estadoFinal);

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
            activeOpacity={0.7}
        >
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">
                        {concepto}
                    </Text>
                    <Text className="text-2xl font-bold text-teal-600">
                        {formatCurrency(monto)}
                    </Text>
                </View>

                <View className="flex-row items-center">
                    <EstadoIcon
                        size={20}
                        color={getIconColor(estadoFinal)}
                    />
                    <Text className={`ml-2 font-medium ${getEstadoColor(estadoFinal)}`}>
                        {estadoFinal}
                    </Text>
                </View>
            </View>

            {pago.descripcion && (
                <Text className="text-gray-600 text-sm mb-3">
                    {pago.descripcion}
                </Text>
            )}

            {pago.id_mascota && (
                <View className="flex-row items-center mb-3">
                    <Text className="text-gray-600 text-sm">
                        Mascota: <Text className="font-medium">{pago.id_mascota.nombre}</Text>
                    </Text>
                </View>
            )}

            <View className="border-t border-gray-100 pt-3">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-gray-500 text-xs">Fecha de emisión</Text>
                    <Text className="text-gray-700 text-xs font-medium">
                        {formatDate(pago.fecha_emision)}
                    </Text>
                </View>

                {pago.fecha_vencimiento && (
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-gray-500 text-xs">Fecha de vencimiento</Text>
                        <Text className={`text-xs font-medium ${isVencido() ? 'text-red-600' : 'text-gray-700'
                            }`}>
                            {formatDate(pago.fecha_vencimiento)}
                        </Text>
                    </View>
                )}

                {pago.fecha_pago && (
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-gray-500 text-xs">Fecha de pago</Text>
                        <Text className="text-green-600 text-xs font-medium">
                            {formatDate(pago.fecha_pago)}
                        </Text>
                    </View>
                )}

                {pago.metodo_pago && (
                    <View className="flex-row justify-between items-center">
                        <Text className="text-gray-500 text-xs">Método de pago</Text>
                        <Text className="text-gray-700 text-xs font-medium">
                            {pago.metodo_pago}
                        </Text>
                    </View>
                )}
            </View>

            {pago.estado === 'pendiente' && onMarcarPagado && (
                <TouchableOpacity
                    onPress={onMarcarPagado}
                    className="mt-3 bg-teal-600 rounded-lg py-2 px-4 flex-row items-center justify-center"
                    activeOpacity={0.8}
                >
                    <CreditCard size={16} color="#ffffff" />
                    <Text className="text-white font-semibold ml-2">
                        Pagar con Tarjeta
                    </Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};
