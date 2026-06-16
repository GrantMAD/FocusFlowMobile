import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientHeaderProps {
  title: string;
  subtitle?: string;
}

export function GradientHeader({ title, subtitle }: GradientHeaderProps) {
  return (
    <LinearGradient
      colors={['#7C3AED', '#4F46E5']}
      className="pt-4 pb-8 px-8"
    >
      <Text className="text-3xl font-black text-white">{title}</Text>
      {subtitle && <Text className="text-purple-100 font-medium mt-1">{subtitle}</Text>}
    </LinearGradient>
  );
}
