import React from 'react';
import { LucideIconProps } from 'lucide-react-native';

interface TabIconProps {
  focused: boolean;
  IconComponent: React.ComponentType<LucideIconProps>;
  size?: number;
}

export const TabIcon: React.FC<TabIconProps> = ({ 
  focused, 
  IconComponent, 
  size = 24 
}) => (
  <IconComponent 
    size={size} 
    color={focused ? '#3B82F6' : '#9CA3AF'} 
    strokeWidth={focused ? 2.5 : 2}
  />
);
