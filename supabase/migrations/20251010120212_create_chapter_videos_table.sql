/*
  # Create Chapter Videos Table

  1. New Tables
    - `chapter_videos`
      - `id` (uuid, primary key)
      - `book_number` (integer, reference to bible_books)
      - `chapter` (integer)
      - `video_url` (text, URL to the generated video)
      - `script` (text, the generated script used for video)
      - `status` (text, 'generating' | 'completed' | 'failed')
      - `error_message` (text, nullable, error details if failed)
      - `veo_task_id` (text, nullable, tracking ID from Veo API)
      - `duration_seconds` (integer, nullable, video duration)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - UNIQUE constraint on (book_number, chapter)

  2. Indexes
    - Index on book_number and chapter for fast lookups
    - Index on status for filtering videos by status

  3. Security
    - Enable RLS on chapter_videos table
    - Allow public read access (videos are public)
    - No client write access (managed server-side)
*/

-- Create chapter_videos table
CREATE TABLE IF NOT EXISTS chapter_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_number integer NOT NULL,
  chapter integer NOT NULL,
  video_url text,
  script text,
  status text NOT NULL CHECK (status IN ('generating', 'completed', 'failed')),
  error_message text,
  veo_task_id text,
  duration_seconds integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(book_number, chapter)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chapter_videos_book_chapter 
  ON chapter_videos(book_number, chapter);

CREATE INDEX IF NOT EXISTS idx_chapter_videos_status 
  ON chapter_videos(status);

-- Enable Row Level Security
ALTER TABLE chapter_videos ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to chapter_videos"
  ON chapter_videos FOR SELECT
  TO public
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chapter_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_chapter_videos_updated_at_trigger ON chapter_videos;
CREATE TRIGGER update_chapter_videos_updated_at_trigger
  BEFORE UPDATE ON chapter_videos
  FOR EACH ROW
  EXECUTE FUNCTION update_chapter_videos_updated_at();
