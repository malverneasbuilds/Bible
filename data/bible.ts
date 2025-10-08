import { Book, Verse } from '../types/bible';

export const BIBLE_BOOKS: Book[] = [
  // Old Testament
  { id: 'genesis', name: 'Genesis', chapters: 50, testament: 'old' },
  { id: 'exodus', name: 'Exodus', chapters: 40, testament: 'old' },
  { id: 'leviticus', name: 'Leviticus', chapters: 27, testament: 'old' },
  { id: 'numbers', name: 'Numbers', chapters: 36, testament: 'old' },
  { id: 'deuteronomy', name: 'Deuteronomy', chapters: 34, testament: 'old' },
  { id: 'joshua', name: 'Joshua', chapters: 24, testament: 'old' },
  { id: 'judges', name: 'Judges', chapters: 21, testament: 'old' },
  { id: 'ruth', name: 'Ruth', chapters: 4, testament: 'old' },
  { id: '1samuel', name: '1 Samuel', chapters: 31, testament: 'old' },
  { id: '2samuel', name: '2 Samuel', chapters: 24, testament: 'old' },
  { id: '1kings', name: '1 Kings', chapters: 22, testament: 'old' },
  { id: '2kings', name: '2 Kings', chapters: 25, testament: 'old' },
  { id: 'psalms', name: 'Psalms', chapters: 150, testament: 'old' },
  { id: 'proverbs', name: 'Proverbs', chapters: 31, testament: 'old' },
  { id: 'ecclesiastes', name: 'Ecclesiastes', chapters: 12, testament: 'old' },
  { id: 'isaiah', name: 'Isaiah', chapters: 66, testament: 'old' },
  { id: 'jeremiah', name: 'Jeremiah', chapters: 52, testament: 'old' },
  { id: 'daniel', name: 'Daniel', chapters: 12, testament: 'old' },
  
  // New Testament
  { id: 'matthew', name: 'Matthew', chapters: 28, testament: 'new' },
  { id: 'mark', name: 'Mark', chapters: 16, testament: 'new' },
  { id: 'luke', name: 'Luke', chapters: 24, testament: 'new' },
  { id: 'john', name: 'John', chapters: 21, testament: 'new' },
  { id: 'acts', name: 'Acts', chapters: 28, testament: 'new' },
  { id: 'romans', name: 'Romans', chapters: 16, testament: 'new' },
  { id: '1corinthians', name: '1 Corinthians', chapters: 16, testament: 'new' },
  { id: '2corinthians', name: '2 Corinthians', chapters: 13, testament: 'new' },
  { id: 'galatians', name: 'Galatians', chapters: 6, testament: 'new' },
  { id: 'ephesians', name: 'Ephesians', chapters: 6, testament: 'new' },
  { id: 'philippians', name: 'Philippians', chapters: 4, testament: 'new' },
  { id: 'colossians', name: 'Colossians', chapters: 4, testament: 'new' },
  { id: '1thessalonians', name: '1 Thessalonians', chapters: 5, testament: 'new' },
  { id: '2thessalonians', name: '2 Thessalonians', chapters: 3, testament: 'new' },
  { id: '1timothy', name: '1 Timothy', chapters: 6, testament: 'new' },
  { id: '2timothy', name: '2 Timothy', chapters: 4, testament: 'new' },
  { id: 'hebrews', name: 'Hebrews', chapters: 13, testament: 'new' },
  { id: 'james', name: 'James', chapters: 5, testament: 'new' },
  { id: '1peter', name: '1 Peter', chapters: 5, testament: 'new' },
  { id: '2peter', name: '2 Peter', chapters: 3, testament: 'new' },
  { id: '1john', name: '1 John', chapters: 5, testament: 'new' },
  { id: '2john', name: '2 John', chapters: 1, testament: 'new' },
  { id: '3john', name: '3 John', chapters: 1, testament: 'new' },
  { id: 'jude', name: 'Jude', chapters: 1, testament: 'new' },
  { id: 'revelation', name: 'Revelation', chapters: 22, testament: 'new' },
];

// Sample Bible verses for demonstration
export const SAMPLE_VERSES: Record<string, Record<number, Verse[]>> = {
  'john': {
    1: [
      { id: 'john-1-1', book: 'john', chapter: 1, verse: 1, text: 'In the beginning was the Word, and the Word was with God, and the Word was God.' },
      { id: 'john-1-2', book: 'john', chapter: 1, verse: 2, text: 'He was with God in the beginning.' },
      { id: 'john-1-3', book: 'john', chapter: 1, verse: 3, text: 'Through him all things were made; without him nothing was made that has been made.' },
      { id: 'john-1-4', book: 'john', chapter: 1, verse: 4, text: 'In him was life, and that life was the light of all mankind.' },
      { id: 'john-1-5', book: 'john', chapter: 1, verse: 5, text: 'The light shines in the darkness, and the darkness has not overcome it.' },
    ],
    3: [
      { id: 'john-3-16', book: 'john', chapter: 3, verse: 16, text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
      { id: 'john-3-17', book: 'john', chapter: 3, verse: 17, text: 'For God did not send his Son into the world to condemn the world, but to save the world through him.' },
    ]
  },
  'matthew': {
    5: [
      { id: 'matthew-5-3', book: 'matthew', chapter: 5, verse: 3, text: 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.' },
      { id: 'matthew-5-4', book: 'matthew', chapter: 5, verse: 4, text: 'Blessed are those who mourn, for they will be comforted.' },
      { id: 'matthew-5-5', book: 'matthew', chapter: 5, verse: 5, text: 'Blessed are the meek, for they will inherit the earth.' },
      { id: 'matthew-5-6', book: 'matthew', chapter: 5, verse: 6, text: 'Blessed are those who hunger and thirst for righteousness, for they will be filled.' },
    ]
  },
  'psalms': {
    23: [
      { id: 'psalms-23-1', book: 'psalms', chapter: 23, verse: 1, text: 'The Lord is my shepherd, I lack nothing.' },
      { id: 'psalms-23-2', book: 'psalms', chapter: 23, verse: 2, text: 'He makes me lie down in green pastures, he leads me beside quiet waters,' },
      { id: 'psalms-23-3', book: 'psalms', chapter: 23, verse: 3, text: 'he refreshes my soul. He guides me along the right paths for his name\'s sake.' },
      { id: 'psalms-23-4', book: 'psalms', chapter: 23, verse: 4, text: 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.' },
    ]
  },
  'romans': {
    8: [
      { id: 'romans-8-28', book: 'romans', chapter: 8, verse: 28, text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.' },
    ]
  },
  'philippians': {
    4: [
      { id: 'philippians-4-13', book: 'philippians', chapter: 4, verse: 13, text: 'I can do all this through him who gives me strength.' },
    ]
  }
};

export const VERSES_OF_THE_DAY = [
  { id: 'john-3-16', book: 'john', chapter: 3, verse: 16, text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
  { id: 'psalms-23-1', book: 'psalms', chapter: 23, verse: 1, text: 'The Lord is my shepherd, I lack nothing.' },
  { id: 'romans-8-28', book: 'romans', chapter: 8, verse: 28, text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.' },
  { id: 'philippians-4-13', book: 'philippians', chapter: 4, verse: 13, text: 'I can do all this through him who gives me strength.' },
  { id: 'matthew-5-3', book: 'matthew', chapter: 5, verse: 3, text: 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.' },
];