import { Book, Verse } from '../types/bible';

export const COMPLETE_BIBLE_BOOKS: Book[] = [
  { id: 'gen', name: 'Genesis', chapters: 50, testament: 'old' },
  { id: 'exo', name: 'Exodus', chapters: 40, testament: 'old' },
  { id: 'lev', name: 'Leviticus', chapters: 27, testament: 'old' },
  { id: 'num', name: 'Numbers', chapters: 36, testament: 'old' },
  { id: 'deu', name: 'Deuteronomy', chapters: 34, testament: 'old' },
  { id: 'jos', name: 'Joshua', chapters: 24, testament: 'old' },
  { id: 'jdg', name: 'Judges', chapters: 21, testament: 'old' },
  { id: 'rut', name: 'Ruth', chapters: 4, testament: 'old' },
  { id: '1sa', name: '1 Samuel', chapters: 31, testament: 'old' },
  { id: '2sa', name: '2 Samuel', chapters: 24, testament: 'old' },
  { id: '1ki', name: '1 Kings', chapters: 22, testament: 'old' },
  { id: '2ki', name: '2 Kings', chapters: 25, testament: 'old' },
  { id: '1ch', name: '1 Chronicles', chapters: 29, testament: 'old' },
  { id: '2ch', name: '2 Chronicles', chapters: 36, testament: 'old' },
  { id: 'ezr', name: 'Ezra', chapters: 10, testament: 'old' },
  { id: 'neh', name: 'Nehemiah', chapters: 13, testament: 'old' },
  { id: 'est', name: 'Esther', chapters: 10, testament: 'old' },
  { id: 'job', name: 'Job', chapters: 42, testament: 'old' },
  { id: 'psa', name: 'Psalms', chapters: 150, testament: 'old' },
  { id: 'pro', name: 'Proverbs', chapters: 31, testament: 'old' },
  { id: 'ecc', name: 'Ecclesiastes', chapters: 12, testament: 'old' },
  { id: 'sol', name: 'Song of Solomon', chapters: 8, testament: 'old' },
  { id: 'isa', name: 'Isaiah', chapters: 66, testament: 'old' },
  { id: 'jer', name: 'Jeremiah', chapters: 52, testament: 'old' },
  { id: 'lam', name: 'Lamentations', chapters: 5, testament: 'old' },
  { id: 'eze', name: 'Ezekiel', chapters: 48, testament: 'old' },
  { id: 'dan', name: 'Daniel', chapters: 12, testament: 'old' },
  { id: 'hos', name: 'Hosea', chapters: 14, testament: 'old' },
  { id: 'joe', name: 'Joel', chapters: 3, testament: 'old' },
  { id: 'amo', name: 'Amos', chapters: 9, testament: 'old' },
  { id: 'oba', name: 'Obadiah', chapters: 1, testament: 'old' },
  { id: 'jon', name: 'Jonah', chapters: 4, testament: 'old' },
  { id: 'mic', name: 'Micah', chapters: 7, testament: 'old' },
  { id: 'nah', name: 'Nahum', chapters: 3, testament: 'old' },
  { id: 'hab', name: 'Habakkuk', chapters: 3, testament: 'old' },
  { id: 'zep', name: 'Zephaniah', chapters: 3, testament: 'old' },
  { id: 'hag', name: 'Haggai', chapters: 2, testament: 'old' },
  { id: 'zec', name: 'Zechariah', chapters: 14, testament: 'old' },
  { id: 'mal', name: 'Malachi', chapters: 4, testament: 'old' },
  { id: 'mat', name: 'Matthew', chapters: 28, testament: 'new' },
  { id: 'mar', name: 'Mark', chapters: 16, testament: 'new' },
  { id: 'luk', name: 'Luke', chapters: 24, testament: 'new' },
  { id: 'joh', name: 'John', chapters: 21, testament: 'new' },
  { id: 'act', name: 'Acts', chapters: 28, testament: 'new' },
  { id: 'rom', name: 'Romans', chapters: 16, testament: 'new' },
  { id: '1co', name: '1 Corinthians', chapters: 16, testament: 'new' },
  { id: '2co', name: '2 Corinthians', chapters: 13, testament: 'new' },
  { id: 'gal', name: 'Galatians', chapters: 6, testament: 'new' },
  { id: 'eph', name: 'Ephesians', chapters: 6, testament: 'new' },
  { id: 'phi', name: 'Philippians', chapters: 4, testament: 'new' },
  { id: 'col', name: 'Colossians', chapters: 4, testament: 'new' },
  { id: '1th', name: '1 Thessalonians', chapters: 5, testament: 'new' },
  { id: '2th', name: '2 Thessalonians', chapters: 3, testament: 'new' },
  { id: '1ti', name: '1 Timothy', chapters: 6, testament: 'new' },
  { id: '2ti', name: '2 Timothy', chapters: 4, testament: 'new' },
  { id: 'tit', name: 'Titus', chapters: 3, testament: 'new' },
  { id: 'phm', name: 'Philemon', chapters: 1, testament: 'new' },
  { id: 'heb', name: 'Hebrews', chapters: 13, testament: 'new' },
  { id: 'jam', name: 'James', chapters: 5, testament: 'new' },
  { id: '1pe', name: '1 Peter', chapters: 5, testament: 'new' },
  { id: '2pe', name: '2 Peter', chapters: 3, testament: 'new' },
  { id: '1jo', name: '1 John', chapters: 5, testament: 'new' },
  { id: '2jo', name: '2 John', chapters: 1, testament: 'new' },
  { id: '3jo', name: '3 John', chapters: 1, testament: 'new' },
  { id: 'jud', name: 'Jude', chapters: 1, testament: 'new' },
  { id: 'rev', name: 'Revelation', chapters: 22, testament: 'new' },
];

export const COMPLETE_BIBLE_VERSES: Record<string, Record<number, Verse[]>> = {
  'joh': {
    1: [
      { id: 'joh-1-1', book: 'joh', chapter: 1, verse: 1, text: 'In the beginning was the Word, and the Word was with God, and the Word was God.' },
      { id: 'joh-1-2', book: 'joh', chapter: 1, verse: 2, text: 'He was with God in the beginning.' },
      { id: 'joh-1-3', book: 'joh', chapter: 1, verse: 3, text: 'Through him all things were made; without him nothing was made that has been made.' },
      { id: 'joh-1-4', book: 'joh', chapter: 1, verse: 4, text: 'In him was life, and that life was the light of all mankind.' },
      { id: 'joh-1-5', book: 'joh', chapter: 1, verse: 5, text: 'The light shines in the darkness, and the darkness has not overcome it.' },
      { id: 'joh-1-6', book: 'joh', chapter: 1, verse: 6, text: 'There was a man sent from God whose name was John.' },
      { id: 'joh-1-7', book: 'joh', chapter: 1, verse: 7, text: 'He came as a witness to testify concerning that light, so that through him all might believe.' },
      { id: 'joh-1-8', book: 'joh', chapter: 1, verse: 8, text: 'He himself was not the light; he came only as a witness to the light.' },
      { id: 'joh-1-9', book: 'joh', chapter: 1, verse: 9, text: 'The true light that gives light to everyone was coming into the world.' },
      { id: 'joh-1-10', book: 'joh', chapter: 1, verse: 10, text: 'He was in the world, and though the world was made through him, the world did not recognize him.' },
      { id: 'joh-1-11', book: 'joh', chapter: 1, verse: 11, text: 'He came to that which was his own, but his own did not receive him.' },
      { id: 'joh-1-12', book: 'joh', chapter: 1, verse: 12, text: 'Yet to all who did receive him, to those who believed in his name, he gave the right to become children of God.' },
      { id: 'joh-1-13', book: 'joh', chapter: 1, verse: 13, text: 'Children born not of natural descent, nor of human decision or a husband\'s will, but born of God.' },
      { id: 'joh-1-14', book: 'joh', chapter: 1, verse: 14, text: 'The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth.' },
    ],
    3: [
      { id: 'joh-3-16', book: 'joh', chapter: 3, verse: 16, text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
      { id: 'joh-3-17', book: 'joh', chapter: 3, verse: 17, text: 'For God did not send his Son into the world to condemn the world, but to save the world through him.' },
    ]
  },
  'mat': {
    5: [
      { id: 'mat-5-3', book: 'mat', chapter: 5, verse: 3, text: 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.' },
      { id: 'mat-5-4', book: 'mat', chapter: 5, verse: 4, text: 'Blessed are those who mourn, for they will be comforted.' },
      { id: 'mat-5-5', book: 'mat', chapter: 5, verse: 5, text: 'Blessed are the meek, for they will inherit the earth.' },
      { id: 'mat-5-6', book: 'mat', chapter: 5, verse: 6, text: 'Blessed are those who hunger and thirst for righteousness, for they will be filled.' },
      { id: 'mat-5-7', book: 'mat', chapter: 5, verse: 7, text: 'Blessed are the merciful, for they will be shown mercy.' },
      { id: 'mat-5-8', book: 'mat', chapter: 5, verse: 8, text: 'Blessed are the pure in heart, for they will see God.' },
      { id: 'mat-5-9', book: 'mat', chapter: 5, verse: 9, text: 'Blessed are the peacemakers, for they will be called children of God.' },
      { id: 'mat-5-10', book: 'mat', chapter: 5, verse: 10, text: 'Blessed are those who are persecuted because of righteousness, for theirs is the kingdom of heaven.' },
    ]
  },
  'psa': {
    23: [
      { id: 'psa-23-1', book: 'psa', chapter: 23, verse: 1, text: 'The Lord is my shepherd, I lack nothing.' },
      { id: 'psa-23-2', book: 'psa', chapter: 23, verse: 2, text: 'He makes me lie down in green pastures, he leads me beside quiet waters,' },
      { id: 'psa-23-3', book: 'psa', chapter: 23, verse: 3, text: 'he refreshes my soul. He guides me along the right paths for his name\'s sake.' },
      { id: 'psa-23-4', book: 'psa', chapter: 23, verse: 4, text: 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.' },
      { id: 'psa-23-5', book: 'psa', chapter: 23, verse: 5, text: 'You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows.' },
      { id: 'psa-23-6', book: 'psa', chapter: 23, verse: 6, text: 'Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever.' },
    ],
    91: [
      { id: 'psa-91-1', book: 'psa', chapter: 91, verse: 1, text: 'Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty.' },
      { id: 'psa-91-2', book: 'psa', chapter: 91, verse: 2, text: 'I will say of the Lord, "He is my refuge and my fortress, my God, in whom I trust."' },
    ]
  },
  'rom': {
    8: [
      { id: 'rom-8-28', book: 'rom', chapter: 8, verse: 28, text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.' },
      { id: 'rom-8-38', book: 'rom', chapter: 8, verse: 38, text: 'For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers,' },
      { id: 'rom-8-39', book: 'rom', chapter: 8, verse: 39, text: 'neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.' },
    ]
  },
  'phi': {
    4: [
      { id: 'phi-4-6', book: 'phi', chapter: 4, verse: 6, text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.' },
      { id: 'phi-4-7', book: 'phi', chapter: 4, verse: 7, text: 'And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.' },
      { id: 'phi-4-13', book: 'phi', chapter: 4, verse: 13, text: 'I can do all this through him who gives me strength.' },
    ]
  },
  'gen': {
    1: [
      { id: 'gen-1-1', book: 'gen', chapter: 1, verse: 1, text: 'In the beginning God created the heavens and the earth.' },
      { id: 'gen-1-2', book: 'gen', chapter: 1, verse: 2, text: 'Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.' },
      { id: 'gen-1-3', book: 'gen', chapter: 1, verse: 3, text: 'And God said, "Let there be light," and there was light.' },
    ]
  },
  'pro': {
    3: [
      { id: 'pro-3-5', book: 'pro', chapter: 3, verse: 5, text: 'Trust in the Lord with all your heart and lean not on your own understanding;' },
      { id: 'pro-3-6', book: 'pro', chapter: 3, verse: 6, text: 'in all your ways submit to him, and he will make your paths straight.' },
    ]
  },
  'isa': {
    40: [
      { id: 'isa-40-31', book: 'isa', chapter: 40, verse: 31, text: 'but those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.' },
    ]
  },
  'jer': {
    29: [
      { id: 'jer-29-11', book: 'jer', chapter: 29, verse: 11, text: 'For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future.' },
    ]
  },
};

export const VERSES_OF_THE_DAY = [
  { id: 'joh-3-16', book: 'joh', chapter: 3, verse: 16, text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
  { id: 'psa-23-1', book: 'psa', chapter: 23, verse: 1, text: 'The Lord is my shepherd, I lack nothing.' },
  { id: 'rom-8-28', book: 'rom', chapter: 8, verse: 28, text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.' },
  { id: 'phi-4-13', book: 'phi', chapter: 4, verse: 13, text: 'I can do all this through him who gives me strength.' },
  { id: 'mat-5-3', book: 'mat', chapter: 5, verse: 3, text: 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.' },
  { id: 'pro-3-5', book: 'pro', chapter: 3, verse: 5, text: 'Trust in the Lord with all your heart and lean not on your own understanding;' },
  { id: 'isa-40-31', book: 'isa', chapter: 40, verse: 31, text: 'but those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.' },
];

export function generatePlaceholderVerses(bookId: string, chapter: number, verseCount: number = 20): Verse[] {
  const verses: Verse[] = [];
  for (let i = 1; i <= verseCount; i++) {
    verses.push({
      id: `${bookId}-${chapter}-${i}`,
      book: bookId,
      chapter,
      verse: i,
      text: `This is verse ${i} of ${bookId} chapter ${chapter}. The full Bible content can be loaded from an API or included in the app bundle for offline access.`,
    });
  }
  return verses;
}
