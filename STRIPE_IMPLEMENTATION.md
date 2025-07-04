# Configuración de Pagos con Stripe en VetControl

Este documento explica cómo configurar y usar la funcionalidad de pagos con Stripe en la aplicación VetControl.

## Requisitos Previos

1. **Cuenta de Stripe**: Necesitas una cuenta en [Stripe](https://stripe.com)
2. **Claves de API**: Obten tus claves de desarrollo/producción de Stripe
3. **Backend configurado**: El backend debe tener los endpoints de Stripe configurados

## Configuración Frontend

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basado en `.env.example`:

```env
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui
EXPO_PUBLIC_API_URL=http://tu-backend-url:3000
```

### 2. Dependencias

La aplicación ya incluye las dependencias necesarias:
- `@stripe/stripe-react-native`: Para integración con Stripe
- El proveedor de Stripe está configurado en `App.tsx`

## Configuración Backend

### 1. Variables de Entorno del Backend

```env
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
STRIPE_PUBLIC_KEY=pk_test_tu_clave_publica_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui
```

### 2. Endpoints Disponibles

- `POST /stripe/payment-sheet`: Crear Payment Sheet para React Native
- `POST /stripe/create-payment-intent`: Crear Payment Intent (legacy)
- `GET /stripe/payment-intent/:id`: Obtener estado de un pago
- `POST /stripe/create-customer`: Crear customer en Stripe
- `POST /stripe/webhook`: Webhook para eventos de Stripe

## Uso en la Aplicación

### Flujo de Pago

1. **Usuario selecciona pagar**: Presiona el botón "Pagar con Tarjeta" en un pago pendiente
2. **Modal de confirmación**: Se abre `PagoStripeModal` con detalles del pago
3. **Payment Sheet**: Se presenta el Payment Sheet nativo de Stripe
4. **Procesamiento**: El pago se procesa de forma segura
5. **Confirmación**: Se actualiza el estado en el backend y se recarga la lista

### Componentes Principales

- **`PagoStripeModal`**: Modal para confirmar y procesar pagos
- **`stripeService`**: Servicio para manejar la integración con Stripe
- **`PagoCard`**: Card que muestra el botón de pago

### Seguridad

- ✅ Las claves secretas permanecen en el backend
- ✅ Encriptación de nivel bancario de Stripe
- ✅ Tokens de un solo uso para pagos
- ✅ Validación de webhooks para confirmación

## Desarrollo y Testing

### Claves de Prueba

Usa las claves de prueba de Stripe para desarrollo:
- Publishable key: `pk_test_...`
- Secret key: `sk_test_...`

### Tarjetas de Prueba

Stripe proporciona tarjetas de prueba:
- **Éxito**: 4242 4242 4242 4242
- **Declino**: 4000 0000 0000 0002
- **3D Secure**: 4000 0000 0000 3220

### Testing

```bash
# Para testing en emulador Android
npm run android

# Para testing en iOS
npm run ios

# Para testing web
npm run web
```

## Monitoreo

### Logs

La aplicación incluye logging detallado:
- 🔄 Inicio de proceso de pago
- ✅ Pago exitoso
- ❌ Errores de pago
- 📊 Estado de Payment Intents

### Dashboard de Stripe

Monitorea los pagos en el [Dashboard de Stripe](https://dashboard.stripe.com):
- Transacciones en tiempo real
- Webhooks recibidos
- Análisis de pagos

## Solución de Problemas

### Errores Comunes

1. **"Publishable key no configurada"**
   - Verifica el archivo `.env`
   - Reinicia el servidor de desarrollo

2. **"Error al crear Payment Sheet"**
   - Verifica que el backend esté corriendo
   - Revisa las claves de Stripe en el backend

3. **"Payment Sheet no se muestra"**
   - Verifica la configuración del `StripeProvider`
   - Revisa los logs de la consola

### Debug

Activa logs detallados en `services/logger.ts` para debugging avanzado.

## Producción

### Checklist

- [ ] Cambiar claves de desarrollo por claves de producción
- [ ] Configurar webhooks en producción
- [ ] Probar flujo completo en ambiente de producción
- [ ] Configurar monitoreo y alertas
- [ ] Revisar configuración de seguridad

### Webhooks

Configura el endpoint de webhook en Stripe:
```
https://tu-dominio.com/stripe/webhook
```

Eventos recomendados:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `customer.created`

## Soporte

Para soporte adicional:
- [Documentación de Stripe](https://stripe.com/docs)
- [Stripe React Native](https://github.com/stripe/stripe-react-native)
- [Comunidad de Stripe](https://support.stripe.com/)
