import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bell, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Calendar,
  Zap,
  Star
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useNotificationStore } from '@/stores/notificationStore';
import { formatDistanceToNow } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';

export default function NotificationsScreen() {
  const router = useRouter();
  const { 
    notifications, 
    isLoading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={20} color="#10B981" />;
      case 'warning': return <AlertCircle size={20} color="#F59E0B" />;
      case 'error': return <AlertCircle size={20} color="#EF4444" />;
      case 'task': return <Calendar size={20} color="#7C3AED" />;
      case 'streak': return <Zap size={20} color="#F59E0B" />;
      default: return <Bell size={20} color="#6B7280" />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-gray-900 dark:text-white">Notifications</Text>
        </View>
        
        {notifications.some(n => !n.is_read) && (
          <TouchableOpacity onPress={() => markAllAsRead()}>
            <Text className="text-purple-600 font-bold text-xs uppercase">Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading && notifications.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="#7C3AED" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          refreshControl={
            <RefreshControl 
              refreshing={isLoading} 
              onRefresh={fetchNotifications} 
              tintColor="#7C3AED" 
            />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <View className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center mb-4">
                <Bell size={32} color="#9CA3AF" />
              </View>
              <Text className="text-gray-500 dark:text-gray-400 font-bold text-lg">No notifications yet</Text>
              <Text className="text-gray-400 dark:text-gray-500 text-sm text-center px-10 mt-2">
                We'll let you know when something important happens!
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => markAsRead(item.id)}
              className={`p-5 rounded-3xl mb-4 border flex-row items-start gap-4 ${
                item.is_read 
                  ? 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800' 
                  : 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/20'
              }`}
            >
              <View className={`p-3 rounded-2xl ${
                item.is_read ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
              }`}>
                {getIcon(item.type)}
              </View>

              <View className="flex-1">
                <View className="flex-row justify-between items-start mb-1">
                  <Text className={`font-black text-base flex-1 mr-2 ${
                    item.is_read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'
                  }`}>
                    {item.title}
                  </Text>
                  {!item.is_read && (
                    <View className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                  )}
                </View>
                <Text className="text-sm text-gray-500 dark:text-gray-400 leading-5 mb-2">
                  {item.message}
                </Text>
                <Text className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </Text>
              </View>

              <TouchableOpacity 
                onPress={() => deleteNotification(item.id)}
                className="p-2"
              >
                <Trash2 size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
