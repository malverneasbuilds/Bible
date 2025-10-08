export interface Verse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface Book {
  id: string;
  name: string;
  chapters: number;
  testament: 'old' | 'new';
}

export interface Chapter {
  book: string;
  chapter: number;
  verses: Verse[];
}

export interface SavedVerse extends Verse {
  savedAt: string;
  highlighted?: boolean;
  highlightColor?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export interface SavedChat {
  id: string;
  title: string;
  verse?: Verse;
  messages: ChatMessage[];
  savedAt: string;
}

export interface UserProgress {
  book: string;
  chaptersRead: number[];
  lastReadChapter: number;
  progressPercentage: number;
}

export interface UserStreaks {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string;
  totalDaysRead: number;
}