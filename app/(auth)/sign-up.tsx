import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      Alert.alert('Error', error.message);
      setIsLoading(false);
    } else {
      if (data.session) {
        router.replace('/(auth)/onboarding/step-1');
      } else {
        Alert.alert('Check your email', 'We sent you a verification link.');
        router.replace('/(auth)/sign-in');
      }
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
              <Text className="text-2xl font-semibold text-gray-900 text-center mt-2">Create account</Text>
              <Text className="text-gray-500 text-center mt-1">Start your focus journey today</Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Full Name</Text>
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900"
                />
              </View>

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
                onPress={handleSignUp}
                disabled={isLoading}
                className="w-full bg-primary-600 py-4 rounded-xl shadow-lg mt-4 flex-row justify-center items-center"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center text-lg font-semibold">Create Account</Text>
                )}
              </TouchableOpacity>
            </View>

            <View className="mt-8 flex-row justify-center">
              <Text className="text-gray-600 text-sm">Already have an account? </Text>
              <Link href="/(auth)/sign-in">
                <Text className="text-primary-600 font-semibold text-sm">Sign in</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
