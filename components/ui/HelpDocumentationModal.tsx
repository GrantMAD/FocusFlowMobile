import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { X, BookOpen, Sun, Zap, Brain, Moon, Info } from 'lucide-react-native';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SECTIONS = [
  {
    title: 'Morning Rituals',
    icon: Sun,
    color: '#10B981', // emerald-500
    text: 'ADHD brains often struggle with "starting friction." A consistent morning ritual signals to your brain that the workday has begun, reducing the cognitive load of deciding what to do first.'
  },
  {
    title: 'Body Doubling',
    icon: Zap,
    color: '#A855F7', // purple-500
    text: 'Working alongside a "simulated partner" provides a social anchor. This psychological presence helps maintain focus and prevents the mind from wandering during deep work sessions.'
  },
  {
    title: 'Brain Dumping',
    icon: Brain,
    color: '#6366F1', // indigo-500
    text: 'Working memory is often limited in ADHD. Externalizing thoughts into the Brain Dump clears "mental RAM," allowing you to focus entirely on the current task without fear of forgetting others.'
  },
  {
    title: 'Evening Reflection',
    icon: Moon,
    color: '#F97316', // orange-500
    text: 'Celebrating small wins is crucial for dopamine regulation. Reflecting on your day helps close the loop and prepares your mind for restful sleep by offloading lingering stress.'
  }
];

export default function HelpDocumentationModal({ isOpen, onClose }: Props) {
  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View className="flex-1 bg-black/60 justify-center p-4">
        <View className="bg-white dark:bg-gray-900 w-full rounded-3xl overflow-hidden max-h-[80vh]">
          {/* Header */}
          <View className="bg-purple-600 p-8">
            <TouchableOpacity onPress={onClose} className="absolute top-4 right-4 p-2 z-10">
              <X className="w-6 h-6 text-white" />
            </TouchableOpacity>
            <View className="flex-row items-center gap-4 pr-12">
              <View className="p-3 bg-white/20 rounded-2xl">
                <BookOpen className="w-8 h-8 text-white" />
              </View>
              <View>
                <Text className="text-2xl font-black text-white">FocusFlow Guide</Text>
                <Text className="text-purple-100 font-medium italic">Understanding your ADHD-friendly toolkit.</Text>
              </View>
            </View>
          </View>

          {/* Content */}
          <ScrollView className="p-8">
            {SECTIONS.map((section, i) => (
              <View key={i} className="flex-row gap-4 mb-6">
                <View className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 items-center justify-center">
                  <section.icon className="w-6 h-6" color={section.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-black text-gray-900 dark:text-gray-100 mb-1">{section.title}</Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{section.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Footer */}
          <View className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
            <TouchableOpacity 
              onPress={onClose}
              className="py-4 bg-gray-900 dark:bg-white rounded-xl items-center"
            >
              <Text className="text-white dark:text-gray-900 font-bold">Got it, thanks!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
