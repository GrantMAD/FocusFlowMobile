import { View, Text, TouchableOpacity, ImageBackground, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Welcome() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1 justify-center px-8">
        <View className="mb-12">
          <Text className="text-5xl font-bold text-gray-900 mb-2">FocusFlow</Text>
          <Text className="text-xl text-gray-600">The ADHD-friendly focus companion.</Text>
        </View>

        <View className="space-y-4">
          <TouchableOpacity 
            onPress={() => router.push('/(auth)/sign-up')}
            className="bg-primary-600 py-4 rounded-2xl shadow-lg"
          >
            <Text className="text-white text-center text-lg font-semibold">Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/(auth)/sign-in')}
            className="py-4 rounded-2xl border border-gray-200"
          >
            <Text className="text-gray-900 text-center text-lg font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SafeAreaView className="mb-8">
        <Text className="text-center text-gray-400 text-sm">
          By continuing, you agree to our Terms and Privacy Policy.
        </Text>
      </SafeAreaView>
    </View>
  );
}
