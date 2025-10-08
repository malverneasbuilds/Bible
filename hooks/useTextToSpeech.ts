import { useState, useEffect, useRef } from 'react';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const [rate, setRate] = useState(0.85);
  const currentTextRef = useRef<string>('');

  const speak = (text: string) => {
    if (isPlaying) {
      stop();
      return;
    }

    currentTextRef.current = text;
    setTotalLength(text.length);
    setIsPlaying(true);
    setIsPaused(false);
    setCurrentPosition(0);

    Speech.speak(text, {
      onDone: () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentPosition(0);
      },
      onStopped: () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentPosition(0);
      },
      onError: () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentPosition(0);
      },
      onStart: () => setCurrentPosition(0),
      rate: rate,
      pitch: 1.0,
      language: 'en-US',
      voice: Platform.OS === 'ios' ? 'com.apple.ttsbundle.Samantha-compact' : undefined,
    });
  };

  const stop = () => {
    Speech.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentPosition(0);
    currentTextRef.current = '';
  };

  const pause = () => {
    if (Platform.OS !== 'web' && isPlaying) {
      Speech.pause();
      setIsPlaying(false);
      setIsPaused(true);
    } else {
      stop();
    }
  };

  const resume = () => {
    if (Platform.OS !== 'web' && isPaused) {
      Speech.resume();
      setIsPlaying(true);
      setIsPaused(false);
    } else if (currentTextRef.current) {
      speak(currentTextRef.current);
    }
  };

  const changeRate = (newRate: number) => {
    const clampedRate = Math.max(0.5, Math.min(2.0, newRate));
    setRate(clampedRate);

    if (isPlaying && currentTextRef.current) {
      stop();
      speak(currentTextRef.current);
    }
  };

  const getAvailableVoices = async () => {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices;
    } catch (error) {
      console.error('Error getting voices:', error);
      return [];
    }
  };

  useEffect(() => {
    return () => {
      if (isPlaying) {
        Speech.stop();
      }
    };
  }, []);

  return {
    isPlaying,
    isPaused,
    currentPosition,
    totalLength,
    rate,
    speak,
    stop,
    pause,
    resume,
    changeRate,
    getAvailableVoices,
  };
}
