import { useState } from 'react';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [totalLength, setTotalLength] = useState(0);

  const speak = (text: string) => {
    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
      setCurrentPosition(0);
      return;
    }

    setTotalLength(text.length);
    setIsPlaying(true);
    
    Speech.speak(text, {
      onDone: () => setIsPlaying(false),
      onStopped: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
      onStart: () => setCurrentPosition(0),
      rate: Platform.OS === 'web' ? 0.9 : 0.8,
      pitch: 1.0,
      language: 'en',
      quality: Platform.OS === 'web' ? undefined : 'enhanced',
    });
  };

  const stop = () => {
    Speech.stop();
    setIsPlaying(false);
    setCurrentPosition(0);
  };

  const pause = () => {
    if (Platform.OS !== 'web') {
      Speech.pause();
    } else {
      Speech.stop();
    }
    setIsPlaying(false);
  };

  const resume = () => {
    if (Platform.OS !== 'web') {
      Speech.resume();
      setIsPlaying(true);
    }
  };

  return {
    isPlaying,
    currentPosition,
    totalLength,
    speak,
    stop,
    pause,
    resume,
  };
}