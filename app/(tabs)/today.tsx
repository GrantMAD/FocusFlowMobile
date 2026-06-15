import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StreakCard from '@/components/today/StreakCard';
import MorningRitual from '@/components/today/MorningRitual';
import EveningReflection from '@/components/today/EveningReflection';
import DailyPriorities from '@/components/today/DailyPriorities';
import OnboardingChecklist from '@/components/ui/OnboardingChecklist';
import QuickCapture from '@/components/today/QuickCapture';

export default function Today() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-6" contentContainerStyle={{ gap: 24, paddingBottom: 40 }}>
        <View>
          <Text className="text-4xl font-black text-gray-900">Today</Text>
          <Text className="text-lg font-medium text-gray-500">Let's make today count.</Text>
        </View>

        <OnboardingChecklist />
        <StreakCard />
        <DailyPriorities />
        <QuickCapture />
        <MorningRitual />
        <EveningReflection />
      </ScrollView>
    </SafeAreaView>
  );
}
