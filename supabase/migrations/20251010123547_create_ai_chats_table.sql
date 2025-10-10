/*
  # Create AI Chats Table

  1. New Tables
    - `ai_chats`
      - `id` (uuid, primary key)
      - `title` (text, auto-generated from first message)
      - `verse_reference` (text, nullable, e.g., "John 3:16")
      - `verse_text` (text, nullable, the verse being discussed)
      - `messages` (jsonb, array of message objects)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Indexes
    - Index on created_at for sorting by recency

  3. Security
    - Enable RLS on ai_chats table
    - Allow public read/write access (no authentication in this app)
*/

-- Create ai_chats table
CREATE TABLE IF NOT EXISTS ai_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  verse_reference text,
  verse_text text,
  messages jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ai_chats_created_at 
  ON ai_chats(created_at DESC);

-- Enable Row Level Security
ALTER TABLE ai_chats ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Allow public read access to ai_chats"
  ON ai_chats FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to ai_chats"
  ON ai_chats FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to ai_chats"
  ON ai_chats FOR UPDATE
  TO public
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_chats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_ai_chats_updated_at_trigger ON ai_chats;
CREATE TRIGGER update_ai_chats_updated_at_trigger
  BEFORE UPDATE ON ai_chats
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_chats_updated_at();
