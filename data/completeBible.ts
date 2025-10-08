import { Book, Verse } from '../types/bible';

export const COMPLETE_BIBLE_BOOKS: Book[] = [
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
  { id: '1chronicles', name: '1 Chronicles', chapters: 29, testament: 'old' },
  { id: '2chronicles', name: '2 Chronicles', chapters: 36, testament: 'old' },
  { id: 'ezra', name: 'Ezra', chapters: 10, testament: 'old' },
  { id: 'nehemiah', name: 'Nehemiah', chapters: 13, testament: 'old' },
  { id: 'esther', name: 'Esther', chapters: 10, testament: 'old' },
  { id: 'job', name: 'Job', chapters: 42, testament: 'old' },
  { id: 'psalms', name: 'Psalms', chapters: 150, testament: 'old' },
  { id: 'proverbs', name: 'Proverbs', chapters: 31, testament: 'old' },
  { id: 'ecclesiastes', name: 'Ecclesiastes', chapters: 12, testament: 'old' },
  { id: 'songofsolomon', name: 'Song of Solomon', chapters: 8, testament: 'old' },
  { id: 'isaiah', name: 'Isaiah', chapters: 66, testament: 'old' },
  { id: 'jeremiah', name: 'Jeremiah', chapters: 52, testament: 'old' },
  { id: 'lamentations', name: 'Lamentations', chapters: 5, testament: 'old' },
  { id: 'ezekiel', name: 'Ezekiel', chapters: 48, testament: 'old' },
  { id: 'daniel', name: 'Daniel', chapters: 12, testament: 'old' },
  { id: 'hosea', name: 'Hosea', chapters: 14, testament: 'old' },
  { id: 'joel', name: 'Joel', chapters: 3, testament: 'old' },
  { id: 'amos', name: 'Amos', chapters: 9, testament: 'old' },
  { id: 'obadiah', name: 'Obadiah', chapters: 1, testament: 'old' },
  { id: 'jonah', name: 'Jonah', chapters: 4, testament: 'old' },
  { id: 'micah', name: 'Micah', chapters: 7, testament: 'old' },
  { id: 'nahum', name: 'Nahum', chapters: 3, testament: 'old' },
  { id: 'habakkuk', name: 'Habakkuk', chapters: 3, testament: 'old' },
  { id: 'zephaniah', name: 'Zephaniah', chapters: 3, testament: 'old' },
  { id: 'haggai', name: 'Haggai', chapters: 2, testament: 'old' },
  { id: 'zechariah', name: 'Zechariah', chapters: 14, testament: 'old' },
  { id: 'malachi', name: 'Malachi', chapters: 4, testament: 'old' },
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
  { id: 'titus', name: 'Titus', chapters: 3, testament: 'new' },
  { id: 'philemon', name: 'Philemon', chapters: 1, testament: 'new' },
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

export const COMPLETE_BIBLE_VERSES: Record<string, Record<number, Verse[]>> = {
  'john': {
    1: [
      { id: 'john-1-1', book: 'john', chapter: 1, verse: 1, text: 'In the beginning was the Word, and the Word was with God, and the Word was God.' },
      { id: 'john-1-2', book: 'john', chapter: 1, verse: 2, text: 'He was with God in the beginning.' },
      { id: 'john-1-3', book: 'john', chapter: 1, verse: 3, text: 'Through him all things were made; without him nothing was made that has been made.' },
      { id: 'john-1-4', book: 'john', chapter: 1, verse: 4, text: 'In him was life, and that life was the light of all mankind.' },
      { id: 'john-1-5', book: 'john', chapter: 1, verse: 5, text: 'The light shines in the darkness, and the darkness has not overcome it.' },
      { id: 'john-1-6', book: 'john', chapter: 1, verse: 6, text: 'There was a man sent from God whose name was John.' },
      { id: 'john-1-7', book: 'john', chapter: 1, verse: 7, text: 'He came as a witness to testify concerning that light, so that through him all might believe.' },
      { id: 'john-1-8', book: 'john', chapter: 1, verse: 8, text: 'He himself was not the light; he came only as a witness to the light.' },
      { id: 'john-1-9', book: 'john', chapter: 1, verse: 9, text: 'The true light that gives light to everyone was coming into the world.' },
      { id: 'john-1-10', book: 'john', chapter: 1, verse: 10, text: 'He was in the world, and though the world was made through him, the world did not recognize him.' },
      { id: 'john-1-11', book: 'john', chapter: 1, verse: 11, text: 'He came to that which was his own, but his own did not receive him.' },
      { id: 'john-1-12', book: 'john', chapter: 1, verse: 12, text: 'Yet to all who did receive him, to those who believed in his name, he gave the right to become children of God.' },
      { id: 'john-1-13', book: 'john', chapter: 1, verse: 13, text: 'Children born not of natural descent, nor of human decision or a husband\'s will, but born of God.' },
      { id: 'john-1-14', book: 'john', chapter: 1, verse: 14, text: 'The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth.' },
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
      { id: 'matthew-5-7', book: 'matthew', chapter: 5, verse: 7, text: 'Blessed are the merciful, for they will be shown mercy.' },
      { id: 'matthew-5-8', book: 'matthew', chapter: 5, verse: 8, text: 'Blessed are the pure in heart, for they will see God.' },
      { id: 'matthew-5-9', book: 'matthew', chapter: 5, verse: 9, text: 'Blessed are the peacemakers, for they will be called children of God.' },
      { id: 'matthew-5-10', book: 'matthew', chapter: 5, verse: 10, text: 'Blessed are those who are persecuted because of righteousness, for theirs is the kingdom of heaven.' },
    ]
  },
  'psalms': {
    23: [
      { id: 'psalms-23-1', book: 'psalms', chapter: 23, verse: 1, text: 'The Lord is my shepherd, I lack nothing.' },
      { id: 'psalms-23-2', book: 'psalms', chapter: 23, verse: 2, text: 'He makes me lie down in green pastures, he leads me beside quiet waters,' },
      { id: 'psalms-23-3', book: 'psalms', chapter: 23, verse: 3, text: 'he refreshes my soul. He guides me along the right paths for his name\'s sake.' },
      { id: 'psalms-23-4', book: 'psalms', chapter: 23, verse: 4, text: 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.' },
      { id: 'psalms-23-5', book: 'psalms', chapter: 23, verse: 5, text: 'You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows.' },
      { id: 'psalms-23-6', book: 'psalms', chapter: 23, verse: 6, text: 'Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever.' },
    ],
    91: [
      { id: 'psalms-91-1', book: 'psalms', chapter: 91, verse: 1, text: 'Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty.' },
      { id: 'psalms-91-2', book: 'psalms', chapter: 91, verse: 2, text: 'I will say of the Lord, "He is my refuge and my fortress, my God, in whom I trust."' },
    ]
  },
  'romans': {
    8: [
      { id: 'romans-8-28', book: 'romans', chapter: 8, verse: 28, text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.' },
      { id: 'romans-8-38', book: 'romans', chapter: 8, verse: 38, text: 'For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers,' },
      { id: 'romans-8-39', book: 'romans', chapter: 8, verse: 39, text: 'neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.' },
    ]
  },
  'philippians': {
    4: [
      { id: 'philippians-4-6', book: 'philippians', chapter: 4, verse: 6, text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.' },
      { id: 'philippians-4-7', book: 'philippians', chapter: 4, verse: 7, text: 'And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.' },
      { id: 'philippians-4-13', book: 'philippians', chapter: 4, verse: 13, text: 'I can do all this through him who gives me strength.' },
    ]
  },
  'genesis': {
    1: [
      { id: 'genesis-1-1', book: 'genesis', chapter: 1, verse: 1, text: 'In the beginning God created the heavens and the earth.' },
      { id: 'genesis-1-2', book: 'genesis', chapter: 1, verse: 2, text: 'Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.' },
      { id: 'genesis-1-3', book: 'genesis', chapter: 1, verse: 3, text: 'And God said, "Let there be light," and there was light.' },
    ]
  },
  'proverbs': {
    3: [
      { id: 'proverbs-3-5', book: 'proverbs', chapter: 3, verse: 5, text: 'Trust in the Lord with all your heart and lean not on your own understanding;' },
      { id: 'proverbs-3-6', book: 'proverbs', chapter: 3, verse: 6, text: 'in all your ways submit to him, and he will make your paths straight.' },
    ]
  },
  'isaiah': {
    40: [
      { id: 'isaiah-40-31', book: 'isaiah', chapter: 40, verse: 31, text: 'but those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.' },
    ]
  },
  'jeremiah': {
    29: [
      { id: 'jeremiah-29-11', book: 'jeremiah', chapter: 29, verse: 11, text: 'For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future.' },
    ]
  },
};

export const VERSES_OF_THE_DAY = [
  { id: 'john-3-16', book: 'john', chapter: 3, verse: 16, text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
  { id: 'psalms-23-1', book: 'psalms', chapter: 23, verse: 1, text: 'The Lord is my shepherd, I lack nothing.' },
  { id: 'romans-8-28', book: 'romans', chapter: 8, verse: 28, text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.' },
  { id: 'philippians-4-13', book: 'philippians', chapter: 4, verse: 13, text: 'I can do all this through him who gives me strength.' },
  { id: 'matthew-5-3', book: 'matthew', chapter: 5, verse: 3, text: 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.' },
  { id: 'proverbs-3-5', book: 'proverbs', chapter: 3, verse: 5, text: 'Trust in the Lord with all your heart and lean not on your own understanding;' },
  { id: 'isaiah-40-31', book: 'isaiah', chapter: 40, verse: 31, text: 'but those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.' },
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
