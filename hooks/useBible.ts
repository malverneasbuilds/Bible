import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BIBLE_BOOKS, SAMPLE_VERSES, VERSES_OF_THE_DAY, generatePlaceholderVerses } from '../data/bible';
import { Book, Verse, Chapter, SavedVerse, UserProgress, UserStreaks } from '../types/bible';

const STORAGE_KEYS = {
  SAVED_VERSES: 'bible_saved_verses',
  HIGHLIGHTED_VERSES: 'bible_highlighted_verses',
  USER_PROGRESS: 'bible_user_progress',
  USER_STREAKS: 'bible_user_streaks',
  LAST_READING_POSITION: 'bible_last_reading_position',
};

interface LastReadingPosition {
  bookId: string;
  chapter: number;
}

export function useBible() {
  const [books] = useState<Book[]>(BIBLE_BOOKS);
  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>([]);
  const [highlightedVerses, setHighlightedVerses] = useState<SavedVerse[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [userStreaks, setUserStreaks] = useState<UserStreaks>({
    currentStreak: 0,
    longestStreak: 0,
    lastReadDate: '',
    totalDaysRead: 0,
  });
  const [lastReadingPosition, setLastReadingPosition] = useState<LastReadingPosition | null>(null);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [savedVersesData, highlightedVersesData, progressData, streaksData, lastPositionData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SAVED_VERSES),
        AsyncStorage.getItem(STORAGE_KEYS.HIGHLIGHTED_VERSES),
        AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS),
        AsyncStorage.getItem(STORAGE_KEYS.USER_STREAKS),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_READING_POSITION),
      ]);

      if (savedVersesData) setSavedVerses(JSON.parse(savedVersesData));
      if (highlightedVersesData) setHighlightedVerses(JSON.parse(highlightedVersesData));
      if (progressData) setUserProgress(JSON.parse(progressData));
      if (streaksData) setUserStreaks(JSON.parse(streaksData));
      if (lastPositionData) setLastReadingPosition(JSON.parse(lastPositionData));
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  const getVersesByChapter = (bookId: string, chapter: number): Verse[] => {
    if (SAMPLE_VERSES[bookId]?.[chapter]) {
      return SAMPLE_VERSES[bookId][chapter];
    }
    return generatePlaceholderVerses(bookId, chapter, 25);
  };

  const getVerseOfTheDay = (): Verse => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return VERSES_OF_THE_DAY[dayOfYear % VERSES_OF_THE_DAY.length];
  };

  const saveVerse = async (verse: Verse) => {
    const savedVerse: SavedVerse = {
      ...verse,
      savedAt: new Date().toISOString(),
    };
    
    const updatedSavedVerses = [...savedVerses, savedVerse];
    setSavedVerses(updatedSavedVerses);
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_VERSES, JSON.stringify(updatedSavedVerses));
  };

  const highlightVerse = async (verse: Verse, color: string = '#fbbf24') => {
    const highlightedVerse: SavedVerse = {
      ...verse,
      savedAt: new Date().toISOString(),
      highlighted: true,
      highlightColor: color,
    };
    
    const updatedHighlightedVerses = [...highlightedVerses, highlightedVerse];
    setHighlightedVerses(updatedHighlightedVerses);
    await AsyncStorage.setItem(STORAGE_KEYS.HIGHLIGHTED_VERSES, JSON.stringify(updatedHighlightedVerses));
  };

  const isVerseHighlighted = (verse: Verse): boolean => {
    return highlightedVerses.some(hv => hv.id === verse.id);
  };

  const isVerseSaved = (verse: Verse): boolean => {
    return savedVerses.some(sv => sv.id === verse.id);
  };

  const updateReadingProgress = async (bookId: string, chapter: number) => {
    // Update last reading position
    const newPosition: LastReadingPosition = { bookId, chapter };
    setLastReadingPosition(newPosition);
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_READING_POSITION, JSON.stringify(newPosition));

    const bookProgress = userProgress.find(p => p.book === bookId) || {
      book: bookId,
      chaptersRead: [],
      lastReadChapter: 0,
      progressPercentage: 0,
    };

    if (!bookProgress.chaptersRead.includes(chapter)) {
      bookProgress.chaptersRead.push(chapter);
    }

    bookProgress.lastReadChapter = chapter;
    const book = books.find(b => b.id === bookId);
    bookProgress.progressPercentage = book ? (bookProgress.chaptersRead.length / book.chapters) * 100 : 0;

    const updatedProgress = userProgress.filter(p => p.book !== bookId);
    updatedProgress.push(bookProgress);
    
    setUserProgress(updatedProgress);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(updatedProgress));

    // Update streaks
    await updateStreaks();
  };

  const updateStreaks = async () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    let updatedStreaks = { ...userStreaks };

    if (updatedStreaks.lastReadDate !== today) {
      if (updatedStreaks.lastReadDate === yesterday) {
        updatedStreaks.currentStreak += 1;
      } else {
        updatedStreaks.currentStreak = 1;
      }

      updatedStreaks.lastReadDate = today;
      updatedStreaks.totalDaysRead += 1;
      updatedStreaks.longestStreak = Math.max(updatedStreaks.longestStreak, updatedStreaks.currentStreak);

      setUserStreaks(updatedStreaks);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_STREAKS, JSON.stringify(updatedStreaks));
    }
  };

  const searchVerses = (query: string): Verse[] => {
    const results: Verse[] = [];
    const queryLower = query.toLowerCase();

    // Search in sample verses
    Object.keys(SAMPLE_VERSES).forEach(bookId => {
      Object.keys(SAMPLE_VERSES[bookId]).forEach(chapterNum => {
        const chapter = parseInt(chapterNum);
        SAMPLE_VERSES[bookId][chapter].forEach(verse => {
          if (verse.text.toLowerCase().includes(queryLower)) {
            results.push(verse);
          }
        });
      });
    });

    return results;
  };

  return {
    books,
    savedVerses,
    highlightedVerses,
    userProgress,
    userStreaks,
    lastReadingPosition,
    getVersesByChapter,
    getVerseOfTheDay,
    saveVerse,
    highlightVerse,
    isVerseHighlighted,
    isVerseSaved,
    updateReadingProgress,
    searchVerses,
  };
}