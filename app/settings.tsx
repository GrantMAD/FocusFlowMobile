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
  Platform,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { profile, user, fetchProfile, updateProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [avatarUri, setAvatarUri] = useState<string | null>(profile?.avatar_url ?? null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAvatarUri(profile.avatar_url ?? null);
      setAvatarError(false);
    }
  }, [profile]);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photo library to change your avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];

    // Validate size (max 2 MB)
    if (asset.fileSize && asset.fileSize > 2 * 1024 * 1024) {
      Alert.alert('Image too large', 'Please choose an image smaller than 2 MB.');
      return;
    }

    setAvatarUri(asset.uri);
    setAvatarError(false);
    setIsUploadingAvatar(true);

    try {
      // Fetch the image as a blob for upload
      const response = await fetch(asset.uri);
      const blob = await response.blob();

      const ext = asset.uri.split('.').pop() ?? 'jpg';
      const filePath = `avatars/${user!.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, {
          upsert: true,
          contentType: asset.mimeType ?? 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Cache-bust
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: profileError } = await updateProfile({ avatar_url: publicUrl });
      if (profileError) throw profileError;

      setAvatarUri(publicUrl);
      Alert.alert('Success', 'Avatar updated!');
    } catch (err: any) {
      Alert.alert('Upload failed', err?.message ?? 'Could not upload avatar');
      setAvatarUri(profile?.avatar_url ?? null);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    Alert.alert('Remove Avatar', 'Are you sure you want to remove your profile photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          setIsUploadingAvatar(true);
          const { error } = await updateProfile({ avatar_url: null });
          setIsUploadingAvatar(false);
          if (error) {
            Alert.alert('Error', 'Could not remove avatar');
          } else {
            setAvatarUri(null);
          }
        },
      },
    ]);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    const { error } = await updateProfile({ full_name: fullName });
    setIsLoading(false);
    if (error) {
      Alert.alert('Error', 'Could not update profile');
    } else {
      Alert.alert('Success', 'Profile updated');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: isDark ? '#000000' : '#F9FAFB' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 24, paddingBottom: 8, paddingTop: 24 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '900', color: isDark ? '#FFFFFF' : '#111827' }}>Settings</Text>
      </View>

      <ScrollView style={{ padding: 24 }}>
        
        {/* Profile Card */}
        <View style={{
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          padding: 24,
          borderRadius: 24,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: isDark ? '#374151' : '#F3F4F6',
        }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: isDark ? '#FFFFFF' : '#111827', marginBottom: 20 }}>
            Profile
          </Text>

          {/* Avatar Section */}
          <View style={{ alignItems: 'center', marginBottom: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: isDark ? '#374151' : '#F3F4F6' }}>
            <TouchableOpacity onPress={handlePickAvatar} disabled={isUploadingAvatar} activeOpacity={0.8}>
              <View style={{
                width: 88, height: 88, borderRadius: 24,
                backgroundColor: '#EDE9FE',
                alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
                borderWidth: 2,
                borderColor: '#7C3AED',
              }}>
                {avatarUri && !avatarError ? (
                  <Image
                    source={{ uri: avatarUri }}
                    style={{ width: 88, height: 88 }}
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <Text style={{ fontSize: 32, fontWeight: '700', color: '#7C3AED' }}>
                    {displayName[0].toUpperCase()}
                  </Text>
                )}
                {isUploadingAvatar && (
                  <View style={{
                    position: 'absolute', inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.45)',
                    alignItems: 'center', justifyContent: 'center',
                    width: 88, height: 88,
                  }}>
                    <ActivityIndicator color="white" />
                  </View>
                )}
              </View>
              {/* Camera badge */}
              <View style={{
                position: 'absolute', bottom: -4, right: -4,
                width: 28, height: 28, borderRadius: 14,
                backgroundColor: '#7C3AED',
                alignItems: 'center', justifyContent: 'center',
                borderWidth: 2, borderColor: isDark ? '#1F2937' : '#FFFFFF',
              }}>
                <Camera size={14} color="white" />
              </View>
            </TouchableOpacity>

            <Text style={{ fontSize: 13, color: isDark ? '#9CA3AF' : '#6B7280', marginTop: 12 }}>
              Tap to change · JPG, PNG · max 2 MB
            </Text>

            {avatarUri && !avatarError && (
              <TouchableOpacity onPress={handleRemoveAvatar} disabled={isUploadingAvatar} style={{ marginTop: 8 }}>
                <Text style={{ fontSize: 13, color: '#EF4444', fontWeight: '600' }}>Remove photo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Full Name */}
          <Text style={{ fontSize: 14, color: isDark ? '#9CA3AF' : '#6B7280', marginBottom: 8 }}>Full Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={{
              backgroundColor: isDark ? '#111827' : '#F9FAFB',
              padding: 16,
              borderRadius: 12,
              color: isDark ? '#FFFFFF' : '#111827',
              marginBottom: 16,
              fontSize: 15,
            }}
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
          />
          
          <TouchableOpacity 
            onPress={handleUpdate}
            disabled={isLoading}
            style={{
              backgroundColor: '#7C3AED',
              padding: 16,
              borderRadius: 12,
              alignItems: 'center',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: 'white', fontWeight: '700' }}>Update Profile</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* App Features Card */}
        <View style={{
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          padding: 24,
          borderRadius: 24,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: isDark ? '#374151' : '#F3F4F6',
        }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: isDark ? '#FFFFFF' : '#111827', marginBottom: 16 }}>
            App Features
          </Text>
          {profile?.onboarding_progress && Object.entries(profile.onboarding_progress).map(([feature, completed]) => (
            <View key={feature} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
              <Text style={{ color: isDark ? '#D1D5DB' : '#374151', textTransform: 'capitalize' }}>{feature}</Text>
              <Text style={{ fontWeight: '700', color: completed ? '#7C3AED' : '#9CA3AF' }}>
                {completed ? 'Completed' : 'Pending'}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
