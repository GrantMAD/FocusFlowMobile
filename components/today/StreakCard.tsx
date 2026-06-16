import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Flame, Trophy, Target } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { Streak } from '@/types';
import { createNotification } from '@/lib/notifications';

export default function StreakCard() {
  const [streak, setStreak] = useState<Streak | null>(null);
  const [minutesToday, setMinutesToday] = useState(0);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    fetchStreak(user.id);
    fetchDailyMinutes(user.id);
    
    const channel = supabase
      .channel(`streak_changes_${user.id}_${Math.random().toString(36).substring(7)}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'streaks',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        const newStreak = payload.new as Streak;
        if (streak && newStreak.current_streak > streak.current_streak) {
          handleStreakMilestone(newStreak.current_streak);
        }
        setStreak(newStreak);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, streak?.current_streak]);

  const fetchDailyMinutes = async (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase.rpc('get_weekly_stats', { 
      p_user_id: userId,
      p_start_date: today
    });
    if (data?.[0]) setMinutesToday(Number(data[0].total_focus_minutes));
  };

  const handleStreakMilestone = async (days: number) => {
    if (!user) return;
    
    const milestones = [3, 7, 14, 30, 50, 100];
    if (milestones.includes(days)) {
      await createNotification(
        user.id,
        `${days}-Day Streak! 🔥`,
        `Incredible consistency! You've shown up for ${days} days in a row.`,
        'streak'
      );
    }
  };

  const fetchStreak = async (userId: string) => {
    const { data } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data) setStreak(data as Streak);
  };

  return (
    <LinearGradient
      colors={['#9333EA', '#4F46E5', '#2563EB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ borderRadius: 24, padding: 24, boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }}
    >
      <View className="flex-row items-center justify-between mb-8">
        <View className="bg-white/20 p-3 rounded-2xl border border-white/20">
          <Flame size={32} color="#FB923C" fill="#FB923C" />
        </View>
        <View className="items-end">
          <Text className="text-purple-100 text-[10px] font-black uppercase tracking-[2px]">Current Streak</Text>
          <Text className="text-4xl font-black text-white">{streak?.current_streak ?? 0} Days</Text>
        </View>
      </View>

      <View className="flex-row gap-4">
        <View className="flex-1 bg-white/10 p-4 rounded-2xl border border-white/10">
          <View className="flex-row items-center gap-2 mb-1">
            <Trophy size={16} color="#FACC15" />
            <Text className="text-[10px] font-black uppercase tracking-widest text-purple-200">Longest</Text>
          </View>
          <Text className="text-xl font-black text-white">{streak?.longest_streak ?? 0}</Text>
        </View>
        <View className="flex-1 bg-white/10 p-4 rounded-2xl border border-white/10">
          <View className="flex-row items-center gap-2 mb-1">
            <Target size={16} color="#4ADE80" />
            <Text className="text-[10px] font-black uppercase tracking-widest text-purple-200">Wins</Text>
          </View>
          <Text className="text-xl font-black text-white">{streak?.total_tasks_completed ?? 0}</Text>
        </View>
      </View>

      <View className="mt-6 pt-6 border-t border-white/10">
        <Text className="text-sm text-purple-100">
          {minutesToday >= 10 ? (
            <Text>Streak is <Text className="font-bold">safe</Text> for today! Keep it up. 🔥</Text>
          ) : (
            <Text>Focus for <Text className="font-bold">{10 - minutesToday} more minutes</Text> today to keep your streak alive!</Text>
          )}
        </Text>
      </View>
    </LinearGradient>
  );
}
