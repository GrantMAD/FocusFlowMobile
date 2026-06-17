import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import TopBar from '@/components/ui/TopBar';
import UniversalHelpFAB from '@/components/ui/UniversalHelpFAB';

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-1">
      <TopBar />
      <Tabs screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#7C3AED',
        tabBarInactiveTintColor: isDark ? '#4B5563' : '#9CA3AF',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: isDark ? '#1F2937' : '#F3F4F6',
          backgroundColor: isDark ? '#030712' : '#FFFFFF',
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
        }
      }}>
        <Tabs.Screen
          name="today"
          options={{
            title: 'Today',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="today" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="brain-dump"
          options={{
            title: 'Brain Dump',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bulb" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="focus"
          options={{
            title: 'Focus',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="timer" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: 'Tasks',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: 'Progress',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <UniversalHelpFAB />
    </View>
  );
}
