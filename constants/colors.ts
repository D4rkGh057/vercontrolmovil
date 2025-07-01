// Paleta de colores VetControl
export const colors = {
  // Colores principales
  primary: {
    50: '#f0fdfd',
    100: '#ccf7f7',
    200: '#99efef',
    300: '#5ee0e0',
    400: '#2dc7c7',
    500: '#005456', // Color principal exacto
    600: '#004649',
    700: '#003a3c',
    800: '#002d2f',
    900: '#002022',
    950: '#001315', // Verde oscuro sidebar
  },
  
  // Colores secundarios (azul)
  secondary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Azul botones
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Verde para estados de éxito
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Naranja para alertas
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Rojo para estados críticos
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Grises neutrales
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Blanco y negro
  white: '#ffffff',
  black: '#000000',
};

// Colores específicos para componentes
export const componentColors = {
  // Navegación
  tabBarActive: colors.primary[500],
  tabBarInactive: colors.neutral[400],
  tabBarBackground: colors.white,
  tabBarBorder: colors.neutral[200],
  
  // Loading
  loading: colors.primary[500],
  loadingBackground: colors.neutral[50],
  
  // Estados
  available: colors.success[500],
  lowStock: colors.warning[500],
  expired: colors.danger[500],
  pending: colors.warning[500],
  
  // Backgrounds
  screenBackground: colors.neutral[50],
  cardBackground: colors.white,
  sidebarBackground: colors.primary[950],
  
  // Texto
  textPrimary: colors.neutral[900],
  textSecondary: colors.neutral[600],
  textMuted: colors.neutral[400],
  textOnPrimary: colors.white,
  
  // Bordes
  borderLight: colors.neutral[200],
  borderMedium: colors.neutral[300],
  borderDark: colors.neutral[400],
};

// Función helper para obtener colores con transparencia
export const withOpacity = (color: string, opacity: number) => {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};
