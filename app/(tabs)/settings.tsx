import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Palette, 
  CreditCard, 
  LogOut, 
  Save, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { useSubscription } from '@/hooks/useSubscription';

type TabType = 'profile' | 'appearance' | 'subscription';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const { profile, user, updateProfile, signOut } = useAuthStore();
  const { isPro, status } = useSubscription();

  const [fullName, setFullName] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setTheme(profile.theme || 'system');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const { error } = await updateProfile({ full_name: fullName });
    
    if (error) {
      Alert.alert('Error', 'Failed to update profile');
    } else {
      Alert.alert('Success', 'Profile updated successfully');
    }
    setIsSaving(false);
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    const { error } = await updateProfile({ theme: newTheme });
    if (error) {
      Alert.alert('Error', 'Failed to update theme preference');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
  ];

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50 dark:bg-gray-950"
    >
      <ScrollView className="flex-1">
        {/* Hero Header */}
        <LinearGradient
          colors={['#7C3AED', '#4F46E5']}
          className="pt-10 pb-20 px-8"
        >
          <View>
            <Text className="text-4xl font-black text-white">Settings</Text>
            <Text className="text-purple-100 font-medium">Manage your experience.</Text>
          </View>
        </LinearGradient>

        {/* Tab Navigation */}
        <View className="px-6 -mt-8">
          <View className="flex-row bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id as TabType)}
                className={`flex-1 flex-row items-center justify-center py-3 rounded-xl gap-2 ${
                  activeTab === tab.id ? 'bg-purple-600 shadow-md' : ''
                }`}
              >
                <tab.icon 
                  size={16} 
                  color={activeTab === tab.id ? '#FFFFFF' : '#9CA3AF'} 
                />
                <Text 
                  className={`text-xs font-bold ${
                    activeTab === tab.id ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tab Content */}
        <View className="p-6">
          {activeTab === 'profile' && (
            <View className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
              <View>
                <Text className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Your Profile</Text>
                
                <View className="space-y-4">
                  <View>
                    <Text className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">Full Name</Text>
                    <TextInput
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Enter your name"
                      placeholderTextColor="#9CA3AF"
                      className="w-full bg-gray-50 dark:bg-gray-800 px-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 font-bold text-gray-900 dark:text-white"
                    />
                  </View>

                  <View>
                    <Text className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">Email</Text>
                    <View className="w-full bg-gray-100 dark:bg-gray-950 px-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 opacity-60">
                      <Text className="font-bold text-gray-500 dark:text-gray-400">{user?.email}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                onPress={handleSaveProfile}
                disabled={isSaving}
                className="w-full bg-purple-600 py-4 rounded-2xl flex-row items-center justify-center gap-2 shadow-lg"
              >
                {isSaving ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Save size={18} color="white" />
                    <Text className="text-white font-black uppercase tracking-widest">Save Changes</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => signOut()}
                className="w-full bg-red-50 dark:bg-red-950/20 py-4 rounded-2xl flex-row items-center justify-center gap-2 border border-red-100 dark:border-red-900/30 mt-4"
              >
                <LogOut size={18} color="#EF4444" />
                <Text className="text-red-600 dark:text-red-400 font-black uppercase tracking-widest">Sign Out</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'appearance' && (
            <View className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
              <Text className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Theme</Text>
              
              <View className="space-y-3">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => handleThemeChange(t)}
                    className={`flex-row items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                      theme === t 
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' 
                        : 'border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <Text className={`font-bold capitalize ${
                      theme === t ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {t}
                    </Text>
                    {theme === t && <CheckCircle2 size={20} color="#7C3AED" />}
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-[11px] text-gray-400 dark:text-gray-500 italic text-center mt-4">
                Theme changes are saved to your profile and apply across all your devices.
              </Text>
            </View>
          )}

          {activeTab === 'subscription' && (
            <View className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
              <Text className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Subscription Plan</Text>
              
              <View className={`p-6 rounded-3xl border-2 ${
                isPro ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800'
              }`}>
                <View className="flex-row items-center justify-between mb-4">
                  <View>
                    <Text className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Current Plan</Text>
                    <Text className="text-2xl font-black text-gray-900 dark:text-white">
                      {isPro ? 'FocusFlow Pro' : 'Free Tier'}
                    </Text>
                  </View>
                  {isPro && (
                    <View className="bg-purple-600 px-3 py-1 rounded-full">
                      <Text className="text-[10px] font-black text-white uppercase tracking-wider">Active</Text>
                    </View>
                  )}
                </View>

                {isPro ? (
                  <TouchableOpacity className="flex-row items-center gap-1">
                    <Text className="text-purple-600 dark:text-purple-400 font-black uppercase tracking-widest text-xs">Manage Subscription</Text>
                    <ChevronRight size={14} color="#7C3AED" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity className="w-full bg-purple-600 py-4 rounded-2xl items-center justify-center shadow-md mt-2">
                    <Text className="text-white font-black uppercase tracking-widest">Upgrade to Pro</Text>
                  </TouchableOpacity>
                )}
              </View>

              {!isPro && (
                <View className="space-y-3 mt-2">
                  {[
                    'Full progress history & charts',
                    'All ambient sounds (Rain, Forest, etc.)',
                    'Unlimited focus sessions',
                    'Task chunking & subtasks'
                  ].map((feature, i) => (
                    <View key={i} className="flex-row items-center gap-2">
                      <CheckCircle2 size={14} color="#4ADE80" />
                      <Text className="text-xs font-bold text-gray-500 dark:text-gray-400">{feature}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
