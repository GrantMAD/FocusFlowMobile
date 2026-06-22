import { View, ViewProps } from 'react-native';

export function GlassCard({ children, className, ...props }: ViewProps) {
  return (
    <View 
      className={`glass-card rounded-3xl shadow-sm ${className}`} 
      {...props}
    >
      {children}
    </View>
  );
}
