import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage, SavedChat, Verse } from '../types/bible';

const STORAGE_KEYS = {
  SAVED_CHATS: 'bible_saved_chats',
};

export function useAI() {
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateAIResponse = async (message: string, verse?: Verse): Promise<string> => {
    setIsLoading(true);
    
    // Simulate AI response - in a real app, you'd call your AI service here
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = [
      `That's a beautiful verse! ${verse ? `${verse.book} ${verse.chapter}:${verse.verse}` : 'This passage'} reminds us of God's love and faithfulness. The context here speaks to the heart of Christian faith - that we are called to trust in God's plan even when we don't understand it fully.`,
      `This is such a powerful reminder of God's grace. What strikes me most about this verse is how it shows us that God's timing is perfect, and His ways are higher than our ways. How does this verse speak to your current situation?`,
      `Thank you for sharing this verse with me! The original Greek/Hebrew text here emphasizes the concept of steadfast love and mercy. This teaches us about the character of God and how we should live in relationship with Him and others.`,
      `What a wonderful passage to reflect on! This verse has brought comfort to many throughout history. The theological significance here points to themes of redemption, hope, and the transformative power of faith. What aspect of this verse resonates most with you?`,
      `I love how this verse connects to the broader narrative of Scripture. It's amazing how God weaves themes of love, justice, and mercy throughout the Bible. This particular passage shows us how we can apply these truths to our daily lives.`,
    ];
    
    setIsLoading(false);
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const saveChat = async (chat: SavedChat) => {
    const updatedChats = [...savedChats, chat];
    setSavedChats(updatedChats);
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_CHATS, JSON.stringify(updatedChats));
  };

  const loadSavedChats = async () => {
    try {
      const chatsData = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_CHATS);
      if (chatsData) {
        setSavedChats(JSON.parse(chatsData));
      }
    } catch (error) {
      console.error('Error loading saved chats:', error);
    }
  };

  return {
    savedChats,
    isLoading,
    generateAIResponse,
    saveChat,
    loadSavedChats,
  };
}