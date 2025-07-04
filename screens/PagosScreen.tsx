import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    Text,
    View,
    RefreshControl,
    ActivityIndicator,
    Alert,
    TouchableOpacity
} from 'react-native';
import { Container } from '../components/Container';
import { useAuthStore } from '../stores/authStore';
import { usePagosStore } from '../stores/pagosStore';
import { PagoCard, EmptyPagos, PagoStripeModal } from '../components/pagos';
import { Pago } from '../types';
import {
    Filter,
    DollarSign,
    Clock,
    CheckCircle,
    AlertTriangle
} from 'lucide-react-native';

type FiltroEstado = 'Todos' | 'Pendiente' | 'Pagado' | 'Vencido';

export const PagosScreen = () => {
    const { user } = useAuthStore();
    const {
        pagos,
        loading,
        error,
        getPagosByUsuario,
        marcarComoPagado,
        clearError
    } = usePagosStore();

    const [refreshing, setRefreshing] = useState(false);
    const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('Todos');
    const [stripeModalVisible, setStripeModalVisible] = useState(false);
    const [pagoSeleccionado, setPagoSeleccionado] = useState<Pago | null>(null);

    const loadPagos = async () => {
        try {
            if (!user?.id) {
                Alert.alert('Error', 'Usuario no autenticado');
                return;
            }

            console.log('🔍 PagosScreen - Cargando pagos del usuario:', user.id);
            setRefreshing(true);
            await getPagosByUsuario(user.id);
        } catch (error) {
            console.error('❌ Error al cargar pagos:', error);
            Alert.alert('Error', 'No se pudieron cargar los pagos');
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadPagos();
    }, [user?.id]);

    useEffect(() => {
        if (error) {
            Alert.alert('Error', error);
            clearError();
        }
    }, [error]);

    const isVencido = (pago: Pago) => {
        const today = new Date();
        const vencimiento = new Date(pago.fecha_vencimiento);
        return vencimiento < today && pago.estado?.toLowerCase() === 'pendiente';
    };

    const pagosFiltrados = pagos.filter(pago => {
        const estado = pago.estado?.toLowerCase();
        if (filtroEstado === 'Todos') return true;
        if (filtroEstado === 'Vencido') return isVencido(pago);
        return estado === filtroEstado.toLowerCase();
    });

const estadisticas = {
    total: pagos.length,
    pendientes: pagos.filter(p => p.estado === 'pendiente').length,
    pagados: pagos.filter(p => p.estado === 'pagado').length,
    vencidos: pagos.filter(p => isVencido(p)).length,
    montoPendiente: pagos
        .filter(p => p.estado === 'pendiente')
        .reduce((sum, p) => sum + Number(p.monto ?? p.total ?? 0), 0),
    montoPagado: pagos
        .filter(p => p.estado === 'pagado')
        .reduce((sum, p) => sum + Number(p.monto ?? p.total ?? 0), 0)
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(amount) || 0);
};

    const handleMarcarPagado = (pago: Pago) => {
        setPagoSeleccionado(pago);
        setStripeModalVisible(true);
    };

    const handlePaymentSuccess = async (paymentIntentId: string) => {
        try {
            if (!pagoSeleccionado) return;

            const id = pagoSeleccionado.id_pago ?? pagoSeleccionado.id_factura;
            if (!id) {
                throw new Error('ID de pago no encontrado');
            }

            // Marcar como pagado en el backend con el payment intent de Stripe
            await marcarComoPagado(id, 'Tarjeta', paymentIntentId);
            
            // Recargar la lista de pagos
            await loadPagos();
            
        } catch (error) {
            console.error('❌ Error al actualizar el pago:', error);
            Alert.alert('Error', 'No se pudo actualizar el estado del pago');
        }
    };

    const filtros = [
        { label: 'Todos', value: 'Todos' as FiltroEstado, icon: Filter },
        { label: 'Pendientes', value: 'Pendiente' as FiltroEstado, icon: Clock },
        { label: 'Pagados', value: 'Pagado' as FiltroEstado, icon: CheckCircle },
        { label: 'Vencidos', value: 'Vencido' as FiltroEstado, icon: AlertTriangle }
    ];

    if (loading && !refreshing) {
        return (
            <Container>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#005456" />
                    <Text className="mt-4 text-neutral-600">Cargando pagos...</Text>
                </View>
            </Container>
        );
    }

    return (
        <Container>
            <View className="flex-1">
                {/* Header */}
                <View className="px-6 pt-6 pb-4">
                    <Text className="text-2xl font-bold text-neutral-900 mb-2">
                        Mis Pagos
                    </Text>
                    <Text className="text-neutral-600">
                        Gestiona tus facturas y pagos
                    </Text>
                </View>

                {/* Estadísticas */}
                {estadisticas.total > 0 && (
                    <View className="px-6 mb-4">
                        <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                            <View className="flex-row justify-between items-center mb-3">
                                <Text className="text-lg font-semibold text-gray-900">
                                    Resumen
                                </Text>
                                <DollarSign size={20} color="#0d9488" />
                            </View>

                            <View className="flex-row justify-between mb-2">
                                <Text className="text-gray-600">Total de pagos:</Text>
                                <Text className="font-medium text-gray-900">{estadisticas.total}</Text>
                            </View>

                            <View className="flex-row justify-between mb-2">
                                <Text className="text-amber-600">Pendientes:</Text>
                                <Text className="font-medium text-amber-600">{estadisticas.pendientes}</Text>
                            </View>

                            <View className="flex-row justify-between mb-2">
                                <Text className="text-green-600">Pagados:</Text>
                                <Text className="font-medium text-green-600">{estadisticas.pagados}</Text>
                            </View>

                            {estadisticas.vencidos > 0 && (
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-red-600">Vencidos:</Text>
                                    <Text className="font-medium text-red-600">{estadisticas.vencidos}</Text>
                                </View>
                            )}

                            {estadisticas.montoPendiente > 0 && (
                                <View className="border-t border-gray-100 pt-3 mt-3">
                                    <View className="flex-row justify-between">
                                        <Text className="text-gray-700 font-medium">Monto pendiente:</Text>
                                        <Text className="font-bold text-amber-600">
                                            {formatCurrency(estadisticas.montoPendiente)}
                                        </Text>
                                    </View>
                                </View>
                            )}
                            {estadisticas.montoPagado > 0 && (
                                <View className="flex-row justify-between mt-2">
                                    <Text className="text-gray-700 font-medium">Monto pagado:</Text>
                                    <Text className="font-bold text-green-600">
                                        {formatCurrency(estadisticas.montoPagado)}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {/* Filtros */}
                {pagos.length > 0 && (
                    <View className="px-6 mb-4">
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="flex-row"
                        >
                            {filtros.map((filtro, index) => {
                                const IconComponent = filtro.icon;
                                const isSelected = filtroEstado === filtro.value;

                                return (
                                    <TouchableOpacity
                                        key={filtro.value}
                                        onPress={() => setFiltroEstado(filtro.value)}
                                        className={`mr-3 px-4 py-2 rounded-full flex-row items-center ${isSelected
                                            ? 'bg-teal-600'
                                            : 'bg-white border border-gray-200'
                                            }`}
                                    >
                                        <IconComponent
                                            size={16}
                                            color={isSelected ? '#ffffff' : '#6b7280'}
                                        />
                                        <Text className={`ml-2 font-medium ${isSelected ? 'text-white' : 'text-gray-700'
                                            }`}>
                                            {filtro.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                )}

                {/* Lista de pagos */}
                <ScrollView
                    className="flex-1 px-6"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={loadPagos} />
                    }
                    showsVerticalScrollIndicator={false}
                >
                    {pagosFiltrados.length === 0 ? (
                        <EmptyPagos />
                    ) : (
                        pagosFiltrados.map((pago) => (
                            <PagoCard
                                key={pago.id_pago ?? pago.id_factura}
                                pago={pago}
                                onMarcarPagado={() => handleMarcarPagado(pago)}
                            />
                        ))
                    )}
                </ScrollView>

                {/* Modal de pago con Stripe */}
                <PagoStripeModal
                    visible={stripeModalVisible}
                    pago={pagoSeleccionado}
                    onClose={() => setStripeModalVisible(false)}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            </View>
        </Container>
    );
};
