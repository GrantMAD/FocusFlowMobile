import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { HelpCircle } from 'lucide-react-native';
import HelpDocumentationModal from './HelpDocumentationModal';

export default function UniversalHelpFAB() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <TouchableOpacity 
        className="absolute bottom-20 right-6 p-4 bg-purple-600 rounded-full shadow-lg"
        onPress={() => setIsModalOpen(true)}
      >
        <HelpCircle size={24} color="white" />
      </TouchableOpacity>
      
      <HelpDocumentationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
