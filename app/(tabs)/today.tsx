import { ScrollView, View } from 'react-native';
import StreakCard from '@/components/today/StreakCard';
import MorningRitual from '@/components/today/MorningRitual';
import EveningReflection from '@/components/today/EveningReflection';
import DailyPriorities from '@/components/today/DailyPriorities';
import OnboardingChecklist from '@/components/ui/OnboardingChecklist';
import QuickCapture from '@/components/today/QuickCapture';
import { GradientHeader } from '@/components/ui/GradientHeader';

export default function Today() {
  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <GradientHeader title="Today" subtitle="Let's make today count." />
      <ScrollView className="flex-1 p-6" contentContainerStyle={{ gap: 24, paddingBottom: 40 }}>
        <OnboardingChecklist />
        <StreakCard />
        <DailyPriorities />
        <QuickCapture />
        <MorningRitual />
        <EveningReflection />
      </ScrollView>
    </View>
  );
}
