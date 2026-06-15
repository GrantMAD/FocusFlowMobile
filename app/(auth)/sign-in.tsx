import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
      setIsLoading(false);
    } else {
      router.replace('/(tabs)/today');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-8">
          <View className="flex-1 justify-center py-12">
            <View className="mb-8">
              <Text className="text-3xl font-bold text-primary-600 text-center">FocusFlow</Text>
              <Text className="text-2xl font-semibold text-gray-900 text-center mt-2">Welcome back</Text>
              <Text className="text-gray-500 text-center mt-1">Sign in to your account</Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Email address</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900"
                />
              </View>

              <TouchableOpacity 
                onPress={handleSignIn}
                disabled={isLoading}
                className="w-full bg-primary-600 py-4 rounded-xl shadow-lg mt-4 flex-row justify-center items-center"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center text-lg font-semibold">Sign In</Text>
                )}
              </TouchableOpacity>
            </View>

            <View className="relative my-8">
              <View className="absolute inset-0 flex items-center justify-center">
                <View className="w-full border-t border-gray-200"></View>
              </View>
              <View className="relative flex-row justify-center">
                <Text className="px-2 bg-white text-gray-500 text-sm">Or continue with</Text>
              </View>
            </View>

            <TouchableOpacity 
              className="w-full flex-row items-center justify-center space-x-3 px-4 py-3 border border-gray-200 rounded-xl"
              onPress={() => Alert.alert('OAuth', 'Google Sign-In coming soon to mobile')}
            >
              <Text className="text-gray-700 font-medium">Google</Text>
            </TouchableOpacity>

            <View className="mt-8 flex-row justify-center">
              <Text className="text-gray-600 text-sm">Don't have an account? </Text>
              <Link href="/(auth)/sign-up">
                <Text className="text-primary-600 font-semibold text-sm">Sign up</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
