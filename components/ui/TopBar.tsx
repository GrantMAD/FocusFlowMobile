import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  Easing,
  Image
} from 'react-native';
import {
  Menu,
  Bell,
  Settings,
  LogOut,
  X,
  CheckCircle2,
  AlertCircle,
  Zap,
  Calendar,
  ChevronRight
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { formatDistanceToNow } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

export default function TopBar() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signOut, user, profile } = useAuthStore();
  const {
    notifications,
    unreadCount,
    subscribeToNotifications,
    fetchNotifications,
    markAsRead
  } = useNotificationStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const slideAnim = useRef(new Animated.Value(-320)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isMenuOpen ? 0 : -320,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [isMenuOpen]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const unsubscribe = subscribeToNotifications(user.id);
      return () => unsubscribe();
    }
  }, [user]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={16} color="#10B981" />;
      case 'warning': return <AlertCircle size={16} color="#F59E0B" />;
      case 'error': return <AlertCircle size={16} color="#EF4444" />;
      case 'task': return <Calendar size={16} color="#7C3AED" />;
      case 'streak': return <Zap size={16} color="#F59E0B" />;
      default: return <Bell size={16} color="#6B7280" />;
    }
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <>
      <View
        style={{ paddingTop: insets.top }}
        className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900 z-50"
      >
        <View className="h-16 px-6 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => setIsMenuOpen(true)}
            className="p-2 -ml-2"
          >
            <Menu size={24} color="#6B7280" />
          </TouchableOpacity>

          <Text className="text-xl font-black text-purple-600">FocusFlow</Text>

          <TouchableOpacity
            onPress={() => setIsNotifOpen(true)}
            className="p-2 -mr-2 relative"
          >
            <Bell size={24} color="#6B7280" />
            {unreadCount > 0 && (
              <View className="absolute top-1 right-1 bg-red-500 w-5 h-5 rounded-full items-center justify-center border-2 border-white dark:border-gray-950">
                <Text className="text-[10px] text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Notifications Dropdown */}
      <Modal
        visible={isNotifOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsNotifOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/10"
          onPress={() => setIsNotifOpen(false)}
        >
          <View
            style={{
              position: 'absolute',
              top: insets.top + 60,
              right: 20,
              width: width * 0.85,
              maxWidth: 400
            }}
          >
            <View
              style={{
                width: 0,
                height: 0,
                backgroundColor: 'transparent',
                borderStyle: 'solid',
                borderLeftWidth: 10,
                borderRightWidth: 10,
                borderBottomWidth: 10,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: 'white',
                alignSelf: 'flex-end',
                marginRight: 10,
                transform: [{ translateY: 1 }]
              }}
              className="dark:border-bottom-gray-900"
            />

            <View className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <View className="p-4 border-b border-gray-50 dark:border-gray-800 flex-row justify-between items-center">
                <Text className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-[10px]">Recent Notifications</Text>
                <TouchableOpacity onPress={() => setIsNotifOpen(false)}>
                  <X size={14} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
                {notifications.length === 0 ? (
                  <View className="py-12 items-center">
                    <Bell size={32} color="#E5E7EB" />
                    <Text className="text-gray-400 font-bold mt-2 text-sm">No notifications</Text>
                  </View>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <TouchableOpacity
                      key={n.id}
                      onPress={() => {
                        markAsRead(n.id);
                        setIsNotifOpen(false);
                        if (n.link) router.push(n.link as any);
                      }}
                      className={`p-4 border-b border-gray-50 dark:border-gray-800 flex-row gap-3 ${!n.is_read ? 'bg-purple-50/30 dark:bg-purple-900/10' : ''}`}
                    >
                      <View className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl h-10 w-10 items-center justify-center">
                        {getIcon(n.type)}
                      </View>
                      <View className="flex-1">
                        <Text className="font-bold text-gray-900 dark:text-white text-sm mb-0.5" numberOfLines={1}>{n.title}</Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-xs leading-4" numberOfLines={2}>{n.message}</Text>
                        <Text className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>

              <TouchableOpacity
                onPress={() => {
                  setIsNotifOpen(false);
                  router.push('/notifications');
                }}
                className="p-4 bg-gray-50 dark:bg-gray-800 items-center border-t border-gray-100 dark:border-gray-700"
              >
                <Text className="text-purple-600 dark:text-purple-400 font-black uppercase tracking-widest text-[10px]">Show All Notifications</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Hamburger Menu Modal */}
      <Modal
        visible={isMenuOpen}
        transparent
        animationType="none"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <View className="flex-1 flex-row">
          {/* Backdrop */}
          <Pressable
            onPress={() => setIsMenuOpen(false)}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}
          />

          <Animated.View
            style={{
              width: 300,
              transform: [{ translateX: slideAnim }],
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              overflow: 'hidden',
            }}
          >
            {/* Glass background layer */}
            <BlurView
              intensity={60}
              tint={isDark ? 'dark' : 'light'}
              style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 32 }}
            >
              {/* Overlay tint on top of blur */}
              <View
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: isDark ? 'rgba(30,10,60,0.45)' : 'rgba(180,140,255,0.18)',
                  borderRightWidth: 0.5,
                  borderRightColor: 'rgba(255,255,255,0.2)',
                }}
              />

              <View style={{ paddingTop: insets.top }}>
                {/* Header row */}
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 28, marginTop: 12 }}>
                  <TouchableOpacity
                    onPress={() => setIsMenuOpen(false)}
                    style={{
                      width: 32, height: 32, borderRadius: 16,
                      backgroundColor: 'rgba(255,255,255,0.12)',
                      borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.25)',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <X size={16} color="rgba(255,255,255,0.85)" />
                  </TouchableOpacity>
                </View>

                {/* Profile section */}
                <View style={{
                  alignItems: 'center', gap: 10, marginBottom: 28,
                  paddingBottom: 24,
                  borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.15)',
                }}>
                  <View style={{
                    width: 68, height: 68, borderRadius: 22,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)',
                    alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden',
                  }}>
                    {profile?.avatar_url && !avatarError ? (
                      <Image
                        source={{ uri: profile.avatar_url }}
                        style={{ width: 68, height: 68, borderRadius: 22 }}
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <Text style={{ fontSize: 26, fontWeight: '700', color: 'white' }}>
                        {displayName[0].toUpperCase()}
                      </Text>
                    )}
                  </View>
                  <View style={{ alignItems: 'center', gap: 2 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: 'rgba(255,255,255,0.95)' }}>
                      {displayName}
                    </Text>
                    <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                      {user?.email}
                    </Text>
                  </View>
                </View>

                {/* Menu items */}
                <View style={{ gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => { setIsMenuOpen(false); router.push('/settings'); }}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 14,
                      padding: 13, borderRadius: 14,
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.12)',
                    }}
                  >
                    <View style={{
                      width: 36, height: 36, borderRadius: 10,
                      backgroundColor: 'rgba(255,255,255,0.12)',
                      borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.18)',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Settings size={18} color="rgba(255,255,255,0.85)" />
                    </View>
                    <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>
                      Settings
                    </Text>
                    <ChevronRight size={16} color="rgba(255,255,255,0.35)" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => { setIsMenuOpen(false); signOut(); }}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 14,
                      padding: 13, borderRadius: 14,
                      backgroundColor: 'rgba(239,68,68,0.12)',
                      borderWidth: 0.5, borderColor: 'rgba(239,68,68,0.25)',
                    }}
                  >
                    <View style={{
                      width: 36, height: 36, borderRadius: 10,
                      backgroundColor: 'rgba(239,68,68,0.15)',
                      borderWidth: 0.5, borderColor: 'rgba(239,68,68,0.25)',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <LogOut size={18} color="#fca5a5" />
                    </View>
                    <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: '#fca5a5' }}>
                      Sign Out
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Version */}
                <View style={{ marginTop: 'auto', paddingTop: 40, alignItems: 'center' }}>
                  <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, textTransform: 'uppercase' }}>
                    FocusFlow v1.0.0
                  </Text>
                </View>
              </View>
            </BlurView>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}
