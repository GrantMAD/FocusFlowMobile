import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { HelpCircle, X } from 'lucide-react-native';
import HelpDocumentationModal from './HelpDocumentationModal';

export default function UniversalHelpFAB() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <>
      <View className="absolute bottom-20 right-6">
        <TouchableOpacity 
          className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-gray-500 rounded-full items-center justify-center border-2 border-white dark:border-gray-900"
          onPress={() => setIsVisible(false)}
        >
          <X size={12} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="p-4 bg-purple-600 rounded-full shadow-lg"
          onPress={() => setIsModalOpen(true)}
        >
          <HelpCircle size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <HelpDocumentationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
