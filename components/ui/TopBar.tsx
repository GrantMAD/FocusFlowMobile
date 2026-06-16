import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  Pressable,
  Animated,
  Dimensions
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

  return (
    <>
      <View 
        style={{ paddingTop: insets.top }}
        className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900 z-50"
      >
        <View className="h-16 px-6 flex-row items-center justify-between">
          {/* Hamburger Menu */}
          <TouchableOpacity 
            onPress={() => setIsMenuOpen(true)}
            className="p-2 -ml-2"
          >
            <Menu size={24} color="#6B7280" />
          </TouchableOpacity>

          {/* Logo/Title */}
          <Text className="text-xl font-black text-purple-600">FocusFlow</Text>

          {/* Notification Bell */}
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
            {/* Arrow */}
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
                      className={`p-4 border-b border-gray-50 dark:border-gray-800 flex-row gap-3 ${!n.is_read ? 'bg-purple-50/30 dark:bg-purple-900/5' : ''}`}
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
            className="flex-1 bg-black/50"
          />
          
          {/* Side Menu */}
          <View className="w-80 bg-white dark:bg-gray-900 h-full p-8 shadow-2xl">
            <View style={{ paddingTop: insets.top }}>
              <View className="flex-row justify-between items-center mb-10">
                <Text className="text-2xl font-black text-gray-900 dark:text-white">Menu</Text>
                <TouchableOpacity onPress={() => setIsMenuOpen(false)} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full">
                  <X size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View className="items-center mb-10">
                <View className="w-20 h-20 bg-purple-600 rounded-3xl items-center justify-center mb-4">
                  <Text className="text-3xl font-black text-white uppercase">{displayName[0]}</Text>
                </View>
                <Text className="text-lg font-black text-gray-900 dark:text-white">{displayName}</Text>
                <Text className="text-sm text-gray-500">{user?.email}</Text>
              </View>

              <View className="space-y-2">
                <TouchableOpacity 
                  onPress={() => {
                    setIsMenuOpen(false);
                    router.push('/(tabs)/settings');
                  }}
                  className="flex-row items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                >
                  <View className="p-2 bg-white dark:bg-gray-900 rounded-xl">
                    <Settings size={20} color="#7C3AED" />
                  </View>
                  <Text className="flex-1 font-bold text-gray-700 dark:text-gray-300">Settings</Text>
                  <ChevronRight size={16} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => {
                    setIsMenuOpen(false);
                    signOut();
                  }}
                  className="flex-row items-center gap-4 p-4 rounded-2xl border border-red-100 dark:border-red-900/20"
                >
                  <View className="p-2 bg-red-50 dark:bg-red-900/10 rounded-xl">
                    <LogOut size={20} color="#EF4444" />
                  </View>
                  <Text className="flex-1 font-bold text-red-600 dark:text-red-400">Sign Out</Text>
                </TouchableOpacity>
              </View>

              <View className="mt-auto items-center">
                <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-[4px]">FocusFlow v1.0.0</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
