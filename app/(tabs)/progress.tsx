import React, { useEffect, useState } from 'react';
import { ScrollView, View, ActivityIndicator, RefreshControl } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { StatsGrid } from '@/components/progress/StatsGrid';
import { WeeklyChart } from '@/components/progress/WeeklyChart';
import { WinsFeed } from '@/components/progress/WinsFeed';
import { GradientHeader } from '@/components/ui/GradientHeader';

export default function Progress() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // 1. Fetch analytical start date
      const { data: startDate } = await supabase.rpc('get_allowed_analytics_start_date', { 
        p_user_id: user.id 
      });

      const effectiveStartDate = startDate || new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];

      // 2. Fetch weekly stats
      const { data: weeklyStats } = await supabase.rpc('get_weekly_stats', { 
        p_user_id: user.id,
        p_start_date: effectiveStartDate
      });

      if (weeklyStats) {
        setStats(weeklyStats[0]);
      }

      // 3. Fetch daily breakdown for chart
      const { data: breakdown } = await supabase.rpc('get_daily_stats_breakdown', { 
        p_user_id: user.id
      });

      if (breakdown) {
        setChartData((breakdown || []).map((d: any) => ({
          day: d.day_label,
          minutes: Number(d.total_minutes),
          tasks: Number(d.tasks_count),
        })));
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  if (isLoading && !isRefreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-950">
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <GradientHeader title="Progress" subtitle="Your focus journey, visualized." />
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#7C3AED" />
        }
      >
        {/* Content Area */}
        <View className="px-6 py-6 pb-12">
          {stats && (
            <StatsGrid 
              totalTasksCompleted={Number(stats.total_tasks_completed)}
              totalFocusMinutes={Number(stats.total_focus_minutes)}
              totalSessions={Number(stats.total_sessions)}
              avgMood={Number(stats.avg_mood)}
            />
          )}

          <View className="mt-8">
            <WeeklyChart data={chartData} />
          </View>
          
          <WinsFeed />
        </View>
      </ScrollView>
    </View>
  );
}
