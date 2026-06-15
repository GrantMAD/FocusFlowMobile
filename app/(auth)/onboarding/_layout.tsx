import { Stack, usePathname } from 'expo-router';
import { View, Text, SafeAreaView } from 'react-native';

export default function OnboardingLayout() {
  const pathname = usePathname();
  // Match step-X from pathname
  const stepMatch = pathname.match(/step-(\d+)/);
  const currentStep = stepMatch ? parseInt(stepMatch[1]) : 1;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 border-b border-gray-100 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-primary-600">FocusFlow</Text>
        <View className="flex-row space-x-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              className={`w-8 h-1 rounded-full ${
                i <= currentStep ? 'bg-primary-600' : 'bg-gray-100'
              }`}
            />
          ))}
        </View>
      </View>
      <View className="flex-1">
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="step-1" />
          <Stack.Screen name="step-2" />
          <Stack.Screen name="step-3" />
          <Stack.Screen name="step-4" />
          <Stack.Screen name="step-5" />
        </Stack>
      </View>
    </SafeAreaView>
  );
}
