/*
  # Create Bible Database Schema

  1. New Tables
    - `bible_books`
      - `id` (uuid, primary key)
      - `book_number` (integer, 1-66)
      - `abbrev` (text, abbreviation like 'gen', 'john')
      - `name` (text, full name like 'Genesis', 'John')
      - `testament` (text, 'old' or 'new')
      - `chapters_count` (integer, number of chapters)
      - `created_at` (timestamptz)
    
    - `bible_verses`
      - `id` (uuid, primary key)
      - `book_id` (uuid, foreign key to bible_books)
      - `book_number` (integer, for faster queries)
      - `chapter` (integer)
      - `verse` (integer)
      - `text` (text, verse content)
      - `created_at` (timestamptz)
    
  2. Indexes
    - Index on book_number, chapter, verse for fast lookups
    - Full-text search index on verse text
    - Index on book_id for joins

  3. Security
    - Enable RLS on all tables
    - Allow public read access (Bible is public domain)
    - No write access from client (data managed server-side)
*/

-- Create bible_books table
CREATE TABLE IF NOT EXISTS bible_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_number integer NOT NULL UNIQUE,
  abbrev text NOT NULL UNIQUE,
  name text NOT NULL,
  testament text NOT NULL CHECK (testament IN ('old', 'new')),
  chapters_count integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create bible_verses table
CREATE TABLE IF NOT EXISTS bible_verses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES bible_books(id) ON DELETE CASCADE,
  book_number integer NOT NULL,
  chapter integer NOT NULL,
  verse integer NOT NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(book_number, chapter, verse)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bible_verses_book_chapter_verse 
  ON bible_verses(book_number, chapter, verse);

CREATE INDEX IF NOT EXISTS idx_bible_verses_book_id 
  ON bible_verses(book_id);

CREATE INDEX IF NOT EXISTS idx_bible_books_abbrev 
  ON bible_books(abbrev);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_bible_verses_text_search 
  ON bible_verses USING gin(to_tsvector('english', text));

-- Enable Row Level Security
ALTER TABLE bible_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_verses ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to bible_books"
  ON bible_books FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to bible_verses"
  ON bible_verses FOR SELECT
  TO public
  USING (true);

-- Insert Bible book metadata
INSERT INTO bible_books (book_number, abbrev, name, testament, chapters_count) VALUES
  (1, 'gen', 'Genesis', 'old', 50),
  (2, 'exo', 'Exodus', 'old', 40),
  (3, 'lev', 'Leviticus', 'old', 27),
  (4, 'num', 'Numbers', 'old', 36),
  (5, 'deu', 'Deuteronomy', 'old', 34),
  (6, 'jos', 'Joshua', 'old', 24),
  (7, 'jdg', 'Judges', 'old', 21),
  (8, 'rut', 'Ruth', 'old', 4),
  (9, '1sa', '1 Samuel', 'old', 31),
  (10, '2sa', '2 Samuel', 'old', 24),
  (11, '1ki', '1 Kings', 'old', 22),
  (12, '2ki', '2 Kings', 'old', 25),
  (13, '1ch', '1 Chronicles', 'old', 29),
  (14, '2ch', '2 Chronicles', 'old', 36),
  (15, 'ezr', 'Ezra', 'old', 10),
  (16, 'neh', 'Nehemiah', 'old', 13),
  (17, 'est', 'Esther', 'old', 10),
  (18, 'job', 'Job', 'old', 42),
  (19, 'psa', 'Psalms', 'old', 150),
  (20, 'pro', 'Proverbs', 'old', 31),
  (21, 'ecc', 'Ecclesiastes', 'old', 12),
  (22, 'sol', 'Song of Solomon', 'old', 8),
  (23, 'isa', 'Isaiah', 'old', 66),
  (24, 'jer', 'Jeremiah', 'old', 52),
  (25, 'lam', 'Lamentations', 'old', 5),
  (26, 'eze', 'Ezekiel', 'old', 48),
  (27, 'dan', 'Daniel', 'old', 12),
  (28, 'hos', 'Hosea', 'old', 14),
  (29, 'joe', 'Joel', 'old', 3),
  (30, 'amo', 'Amos', 'old', 9),
  (31, 'oba', 'Obadiah', 'old', 1),
  (32, 'jon', 'Jonah', 'old', 4),
  (33, 'mic', 'Micah', 'old', 7),
  (34, 'nah', 'Nahum', 'old', 3),
  (35, 'hab', 'Habakkuk', 'old', 3),
  (36, 'zep', 'Zephaniah', 'old', 3),
  (37, 'hag', 'Haggai', 'old', 2),
  (38, 'zec', 'Zechariah', 'old', 14),
  (39, 'mal', 'Malachi', 'old', 4),
  (40, 'mat', 'Matthew', 'new', 28),
  (41, 'mar', 'Mark', 'new', 16),
  (42, 'luk', 'Luke', 'new', 24),
  (43, 'joh', 'John', 'new', 21),
  (44, 'act', 'Acts', 'new', 28),
  (45, 'rom', 'Romans', 'new', 16),
  (46, '1co', '1 Corinthians', 'new', 16),
  (47, '2co', '2 Corinthians', 'new', 13),
  (48, 'gal', 'Galatians', 'new', 6),
  (49, 'eph', 'Ephesians', 'new', 6),
  (50, 'phi', 'Philippians', 'new', 4),
  (51, 'col', 'Colossians', 'new', 4),
  (52, '1th', '1 Thessalonians', 'new', 5),
  (53, '2th', '2 Thessalonians', 'new', 3),
  (54, '1ti', '1 Timothy', 'new', 6),
  (55, '2ti', '2 Timothy', 'new', 4),
  (56, 'tit', 'Titus', 'new', 3),
  (57, 'phm', 'Philemon', 'new', 1),
  (58, 'heb', 'Hebrews', 'new', 13),
  (59, 'jam', 'James', 'new', 5),
  (60, '1pe', '1 Peter', 'new', 5),
  (61, '2pe', '2 Peter', 'new', 3),
  (62, '1jo', '1 John', 'new', 5),
  (63, '2jo', '2 John', 'new', 1),
  (64, '3jo', '3 John', 'new', 1),
  (65, 'jud', 'Jude', 'new', 1),
  (66, 'rev', 'Revelation', 'new', 22)
ON CONFLICT (book_number) DO NOTHING;
