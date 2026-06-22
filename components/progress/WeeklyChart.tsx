import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '@/constants/theme';


interface WeeklyChartData {
  day: string;
  minutes: number;
  tasks: number;
}

interface WeeklyChartProps {
  data: WeeklyChartData[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const maxDataMinutes = Math.max(...data.map(d => d.minutes), 0);
  const chartMax = Math.ceil(Math.max(maxDataMinutes, 60) / 10) * 10;
  
  // Generate labels in increments of 10 from chartMax down to 0
  const yAxisLabels = [];
  for (let i = chartMax; i >= 0; i -= 10) {
    yAxisLabels.push(i);
  }

  return (
    <View className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <Text className="text-lg font-black text-gray-900 dark:text-white mb-6">Focus Minutes (Last 7 Days)</Text>
      
      <View className="flex-row h-64">
        {/* Y-Axis Labels - Positioned towards the left edge */}
        <View className="justify-between pr-4 pb-8 -ml-2">
          {yAxisLabels.map((label, i) => (
            <Text key={i} className="text-[9px] font-black text-gray-300 dark:text-gray-600 text-right w-6">
              {label}
            </Text>
          ))}
        </View>

        {/* Chart Bars */}
        <View className="flex-1">
          <View className="flex-1 flex-row items-end justify-between px-1">
            {data.map((day, i) => {
              const height = (day.minutes / chartMax) * 100;
              return (
                <View key={i} className="items-center flex-1">
                  <View className="w-full px-1 items-center justify-end h-full">
                    <LinearGradient
                      colors={GRADIENTS.primary}
                      className="w-full rounded-t-lg"

                      style={{ height: `${height}%`, minHeight: day.minutes > 0 ? 4 : 0 }}
                    />
                  </View>
                  <Text className="text-[9px] font-black text-gray-400 dark:text-gray-500 mt-3 uppercase">
                    {day.day.substring(0, 3)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View className="mt-8 flex-row items-center justify-center gap-4">
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 bg-purple-600 rounded-full" />
          <Text className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Minutes</Text>
        </View>
      </View>
    </View>
  );
}
