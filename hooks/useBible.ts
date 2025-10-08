import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { Book, Verse, SavedVerse, UserProgress, UserStreaks } from '../types/bible';
import { BIBLE_BOOKS, VERSES_OF_THE_DAY } from '../data/bible';

const STORAGE_KEYS = {
  SAVED_VERSES: 'bible_saved_verses',
  HIGHLIGHTED_VERSES: 'bible_highlighted_verses',
  USER_PROGRESS: 'bible_user_progress',
  USER_STREAKS: 'bible_user_streaks',
  LAST_READING_POSITION: 'bible_last_reading_position',
  CACHED_CHAPTERS: 'bible_cached_chapters_',
};

interface LastReadingPosition {
  bookId: string;
  chapter: number;
}

interface CachedChapter {
  verses: Verse[];
  timestamp: number;
}

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

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

  const getBookByAbbrev = (abbrev: string): Book | undefined => {
    return books.find(b => b.id === abbrev || b.id === abbrev.toLowerCase());
  };

  const getBookNumber = (bookId: string): number => {
    const book = books.find(b => b.id === bookId);
    return book ? books.indexOf(book) + 1 : 1;
  };

  const getVersesByChapter = async (bookId: string, chapter: number): Promise<Verse[]> => {
    const cacheKey = `${STORAGE_KEYS.CACHED_CHAPTERS}${bookId}_${chapter}`;

    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const cachedData: CachedChapter = JSON.parse(cached);
        if (Date.now() - cachedData.timestamp < CACHE_DURATION) {
          return cachedData.verses;
        }
      }
    } catch (error) {
      console.error('Error loading cached chapter:', error);
    }

    try {
      const bookNumber = getBookNumber(bookId);

      const { data, error } = await supabase
        .from('bible_verses')
        .select('*')
        .eq('book_number', bookNumber)
        .eq('chapter', chapter)
        .order('verse');

      if (error) throw error;

      const verses: Verse[] = (data || []).map(v => ({
        id: `${bookId}-${v.chapter}-${v.verse}`,
        book: bookId,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text,
      }));

      const cacheData: CachedChapter = {
        verses,
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));

      return verses;
    } catch (error) {
      console.error('Error fetching verses:', error);
      return [];
    }
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

  const searchVerses = async (query: string): Promise<Verse[]> => {
    const verseReferencePattern = /^(\d?\s*[a-z]+)\s+(\d+):(\d+)(?:-(\d+))?$/i;
    const match = query.match(verseReferencePattern);

    if (match) {
      const bookName = match[1].trim().toLowerCase().replace(/\s+/g, '');
      const chapter = parseInt(match[2]);
      const startVerse = parseInt(match[3]);
      const endVerse = match[4] ? parseInt(match[4]) : startVerse;

      const book = books.find(b =>
        b.id.includes(bookName) ||
        b.name.toLowerCase().replace(/\s+/g, '').includes(bookName)
      );

      if (book) {
        const bookNumber = getBookNumber(book.id);

        const { data, error } = await supabase
          .from('bible_verses')
          .select('*')
          .eq('book_number', bookNumber)
          .eq('chapter', chapter)
          .gte('verse', startVerse)
          .lte('verse', endVerse)
          .order('verse');

        if (!error && data) {
          return data.map(v => ({
            id: `${book.id}-${v.chapter}-${v.verse}`,
            book: book.id,
            chapter: v.chapter,
            verse: v.verse,
            text: v.text,
          }));
        }
      }
    }

    try {
      const { data, error } = await supabase
        .from('bible_verses')
        .select('*, bible_books!inner(abbrev)')
        .textSearch('text', query, {
          type: 'websearch',
          config: 'english',
        })
        .limit(50);

      if (error) throw error;

      return (data || []).map((v: any) => ({
        id: `${v.bible_books.abbrev}-${v.chapter}-${v.verse}`,
        book: v.bible_books.abbrev,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text,
      }));
    } catch (error) {
      console.error('Error searching verses:', error);
      return [];
    }
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
