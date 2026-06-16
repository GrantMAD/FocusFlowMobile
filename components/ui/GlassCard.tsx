import { View, ViewProps } from 'react-native';

export function GlassCard({ children, className, ...props }: ViewProps) {
  return (
    <View 
      className={`bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm ${className}`} 
      {...props}
    >
      {children}
    </View>
  );
}
