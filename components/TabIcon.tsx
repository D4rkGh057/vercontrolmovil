import React from 'react';
import { LucideProps } from 'lucide-react-native';

interface TabIconProps {
  focused: boolean;
  IconComponent: React.ComponentType<LucideProps>;
  size?: number;
}

export const TabIcon: React.FC<TabIconProps> = ({ 
  focused, 
  IconComponent, 
  size = 24 
}) => (
  <IconComponent 
    size={size} 
    color={focused ? '#005456' : '#94a3b8'} 
    strokeWidth={focused ? 2.5 : 2}
  />
);
