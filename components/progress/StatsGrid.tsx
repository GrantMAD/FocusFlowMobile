import React from 'react';
import { View, Text } from 'react-native';
import { Clock, CheckCircle2, Zap, TrendingUp } from 'lucide-react-native';

interface StatsGridProps {
  totalTasksCompleted: number;
  totalFocusMinutes: number;
  totalSessions: number;
  avgMood: number;
}

export function StatsGrid({ 
  totalTasksCompleted, 
  totalFocusMinutes, 
  totalSessions, 
  avgMood 
}: StatsGridProps) {
  const stats = [
    { 
      label: 'Focus Minutes', 
      value: totalFocusMinutes.toString(), 
      icon: Clock, 
      color: '#FFFFFF', 
      bg: 'bg-purple-600', 
      borderColor: 'border-l-purple-500' 
    },
    { 
      label: 'Tasks Done', 
      value: totalTasksCompleted.toString(), 
      icon: CheckCircle2, 
      color: '#FFFFFF', 
      bg: 'bg-emerald-600', 
      borderColor: 'border-l-emerald-500' 
    },
    { 
      label: 'Sessions', 
      value: totalSessions.toString(), 
      icon: Zap, 
      color: '#FFFFFF', 
      bg: 'bg-orange-500', 
      borderColor: 'border-l-orange-500' 
    },
    { 
      label: 'Avg. Mood', 
      value: avgMood ? avgMood.toFixed(1) : 'N/A', 
      icon: TrendingUp, 
      color: '#FFFFFF', 
      bg: 'bg-blue-600', 
      borderColor: 'border-l-blue-600' 
    },
  ];

  return (
    <View className="flex-row flex-wrap justify-between gap-y-4">
      {stats.map((stat) => (
        <View 
          key={stat.label} 
          className={`w-[48%] bg-white dark:bg-gray-900 p-5 rounded-3xl border-l-4 ${stat.borderColor} shadow-sm`}
          style={{ elevation: 2 }}
        >
          <View className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3 shadow-md`}>
            <stat.icon size={20} color={stat.color} />
          </View>
          <Text className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
            {stat.label}
          </Text>
          <Text className="text-2xl font-black text-gray-900 dark:text-white">
            {stat.value}
          </Text>
        </View>
      ))}
    </View>
  );
}
