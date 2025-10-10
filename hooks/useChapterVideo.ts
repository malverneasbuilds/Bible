import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Constants from 'expo-constants';

interface ChapterVideo {
  id: string;
  book_number: number;
  chapter: number;
  video_url: string | null;
  script: string;
  status: 'generating' | 'completed' | 'failed';
  error_message: string | null;
  veo_task_id: string | null;
  duration_seconds: number | null;
  created_at: string;
  updated_at: string;
}

export function useChapterVideo(bookNumber: number, chapter: number) {
  const [video, setVideo] = useState<ChapterVideo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;

  const checkVideoStatus = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('chapter_videos')
        .select('*')
        .eq('book_number', bookNumber)
        .eq('chapter', chapter)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching video:', fetchError);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error checking video status:', err);
      return null;
    }
  };

  const generateVideo = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/generate-chapter-video`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookNumber,
            chapter,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate video');
      }

      if (data.cached) {
        setVideo(data.video);
      } else {
        setVideo(data.video);

        if (data.video.status === 'generating') {
          startPolling();
        }
      }

      return data.video;
    } catch (err: any) {
      setError(err.message);
      console.error('Error generating video:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const pollVideoStatus = async () => {
    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/check-video-status?bookNumber=${bookNumber}&chapter=${chapter}`
      );

      const data = await response.json();

      if (data.success && data.video) {
        setVideo(data.video);

        if (data.video.status === 'completed' || data.video.status === 'failed') {
          return true;
        }
      }

      return false;
    } catch (err) {
      console.error('Error polling video status:', err);
      return false;
    }
  };

  const startPolling = () => {
    const pollInterval = setInterval(async () => {
      const isDone = await pollVideoStatus();
      if (isDone) {
        clearInterval(pollInterval);
      }
    }, 5000);

    setTimeout(() => {
      clearInterval(pollInterval);
    }, 300000);
  };

  const loadExistingVideo = async () => {
    setIsLoading(true);
    const existingVideo = await checkVideoStatus();
    setVideo(existingVideo);
    setIsLoading(false);

    if (existingVideo?.status === 'generating') {
      startPolling();
    }
  };

  useEffect(() => {
    if (bookNumber && chapter) {
      loadExistingVideo();
    }
  }, [bookNumber, chapter]);

  return {
    video,
    isLoading,
    error,
    generateVideo,
    refreshVideo: loadExistingVideo,
  };
}
