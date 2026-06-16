import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export function WinsFeed() {
  const [wins, setWins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    async function fetchWins() {
      if (!user) return;

      const { data } = await supabase
        .from('tasks')
        .select('title, completed_at')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(5);

      if (data) setWins(data);
      setIsLoading(false);
    }

    fetchWins();
  }, [user]);

  if (isLoading) {
    return (
      <View className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mt-8 items-center justify-center">
        <ActivityIndicator color="#7C3AED" />
      </View>
    );
  }

  return (
    <View className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mt-8">
      <View className="flex-row items-center gap-2 mb-6">
        <Trophy size={20} color="#EAB308" />
        <Text className="text-lg font-black text-gray-900">Recent Wins</Text>
      </View>
      
      <View className="gap-3">
        {wins.length === 0 ? (
          <Text className="text-gray-500 text-center py-4">No completed tasks yet. Keep going!</Text>
        ) : (
          wins.map((win, i) => (
            <View key={i} className="p-4 bg-gray-50 rounded-2xl">
              <Text className="font-bold text-gray-900 mb-1" numberOfLines={1}>
                {win.title}
              </Text>
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {win.completed_at ? formatDistanceToNow(new Date(win.completed_at), { addSuffix: true }) : 'Just now'}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
