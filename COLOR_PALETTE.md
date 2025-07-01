# Paleta de Colores VetControl

Esta documentación describe la nueva paleta de colores aplicada al proyecto VetControl, inspirada en la interfaz web del dashboard de gestión de productos.

## 🎨 Colores Principales

### Primary (Verde Oscuro VetControl)
- **Color principal**: `#005456` (primary-500)
- **Uso**: Botones principales, navegación activa, elementos destacados
- **Sidebar oscuro**: `#001315` (primary-950)

### Secondary (Azul)
- **Color secundario**: `#3b82f6` (secondary-500)
- **Uso**: Botones secundarios, enlaces, información adicional

### Estados

#### Success (Verde)
- **Color**: `#22c55e` (success-500)
- **Uso**: Estados positivos, disponible, éxito, confirmaciones

#### Warning (Naranja)
- **Color**: `#f59e0b` (warning-500)
- **Uso**: Alertas, stock bajo, advertencias, por vencer

#### Danger (Rojo)
- **Color**: `#ef4444` (danger-500)
- **Uso**: Errores, elementos vencidos, estados críticos, cancelaciones

### Neutral (Grises)
- **Rango**: desde `#f8fafc` (neutral-50) hasta `#0f172a` (neutral-900)
- **Uso**: Texto, fondos, bordes, elementos neutros

## 📱 Aplicación en la App

### Navegación
```jsx
// Colores de la barra de navegación
tabBarActiveTintColor: '#005456'     // primary-500
tabBarInactiveTintColor: '#94a3b8'   // neutral-400
```

### Componentes de Estado
```jsx
// Estados de inventario
<View className="bg-success-100">    // Disponible
<View className="bg-warning-100">    // Stock bajo
<View className="bg-danger-100">     // Vencido
```

### Botones
```jsx
// Botones principales
<Pressable className="bg-primary-500">    // Acción principal
<Pressable className="bg-secondary-500">  // Acción secundaria
<Pressable className="bg-success-500">    // Acción positiva
```

## 🔧 Configuración Técnica

### Tailwind Config
```javascript
// tailwind.config.js
colors: {
  primary: { /* Teal colors */ },
  secondary: { /* Blue colors */ },
  success: { /* Green colors */ },
  warning: { /* Orange colors */ },
  danger: { /* Red colors */ },
  neutral: { /* Gray colors */ }
}
```

### Constantes de Colores
```typescript
// constants/colors.ts
export const componentColors = {
  tabBarActive: colors.primary[500],
  tabBarInactive: colors.neutral[400],
  // ... más colores específicos
}
```

## 🎯 Ejemplos de Uso

### Dashboard Cards
- **Total Productos**: Icono azul (`#3b82f6`)
- **Lotes Disponibles**: Verde (`#22c55e`)
- **Stock Bajo**: Naranja (`#f59e0b`)
- **Vencidos**: Rojo (`#ef4444`)

### Estados de Productos
- ✅ **Disponible**: Verde claro (`bg-success-100`) con texto verde (`text-success-700`)
- ⚠️ **Stock Bajo**: Naranja claro (`bg-warning-100`) con texto naranja (`text-warning-700`)
- ❌ **Vencido**: Rojo claro (`bg-danger-100`) con texto rojo (`text-danger-700`)

### Navegación
- **Activo**: Verde oscuro VetControl (`#005456`)
- **Inactivo**: Gris medio (`#94a3b8`)

## 📋 Lista de Verificación

- [x] Configuración de Tailwind con colores personalizados
- [x] Constantes de colores para TypeScript
- [x] Actualización de componentes de navegación
- [x] Aplicación en HomeScreen
- [x] Creación de componentes demo
- [x] Clases CSS personalizadas
- [x] Documentación completa

## 🚀 Siguientes Pasos

1. Aplicar la paleta en todas las pantallas restantes
2. Crear componentes reutilizables con la nueva paleta
3. Implementar tema oscuro usando las mismas bases de color
4. Agregar animaciones y transiciones consistentes

## 🎨 Comparación Visual

**Antes**: Paleta genérica con azules y grises estándar
**Después**: Paleta cohesiva inspirada en la interfaz web con verde azulado como color principal

La nueva paleta proporciona:
- ✨ Mayor consistencia visual con la web
- 🎯 Mejor jerarquía de información
- 🔍 Claridad en estados de inventario
- 💚 Identidad visual veterinaria profesional
