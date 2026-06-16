import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Audio } from 'expo-av';
import { Volume2 } from 'lucide-react-native';

const SOUNDS = [
  { id: 'cafe', title: 'Cafe', file: require('@/assets/sounds/Cafe.wav') },
  { id: 'rain', title: 'Rain', file: require('@/assets/sounds/Rain.wav') },
  { id: 'forest', title: 'Forest', file: require('@/assets/sounds/Forest.wav') },
  { id: 'white_noise', title: 'White Noise', file: require('@/assets/sounds/white_noise.wav') },
  { id: 'ocean', title: 'Ocean', file: require('@/assets/sounds/Ocean.wav') },
  { id: 'fire', title: 'Fire', file: require('@/assets/sounds/Fire.wav') },
];

export default function AmbientSoundPicker() {
  const [sound, setSound] = React.useState<Audio.Sound | null>(null);
  const [playing, setPlaying] = React.useState<string | null>(null);

  const playSound = async (item: typeof SOUNDS[0]) => {
    if (sound) await sound.unloadAsync();

    if (playing === item.id) {
      setPlaying(null);
      return;
    }

    const { sound: newSound } = await Audio.Sound.createAsync(item.file, { isLooping: true });
    setSound(newSound);
    await newSound.playAsync();
    setPlaying(item.id);
  };

  return (
    <View className="mt-8">
      <View className="flex-row items-center gap-2 mb-4">
        <Volume2 size={18} color="#7C3AED" />
        <Text className="text-lg font-black text-gray-900 dark:text-white">Ambient Sounds</Text>
      </View>
      <FlatList
        data={SOUNDS}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => playSound(item)}
            className={`px-6 py-4 rounded-2xl border-2 transition-all mr-3 ${
              playing === item.id 
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' 
                : 'border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <Text className={`font-bold ${
              playing === item.id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}
