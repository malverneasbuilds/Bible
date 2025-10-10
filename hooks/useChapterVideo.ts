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
  const supabaseAnonKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

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
    console.log('🎬 [CLIENT] Starting video generation...');
    console.log('🎬 [CLIENT] Book:', bookNumber, 'Chapter:', chapter);
    setIsLoading(true);
    setError(null);

    try {
      if (!supabaseUrl) {
        console.error('❌ [CLIENT] Supabase URL not configured');
        throw new Error('Supabase URL not configured');
      }

      const url = `${supabaseUrl}/functions/v1/generate-chapter-video`;
      console.log('📡 [CLIENT] Edge Function URL:', url);
      console.log('📡 [CLIENT] Request payload:', { bookNumber, chapter });

      console.log('📡 [CLIENT] Sending request to Edge Function...');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify({
          bookNumber,
          chapter,
        }),
      });

      console.log('✅ [CLIENT] Response received. Status:', response.status);
      console.log('✅ [CLIENT] Response OK:', response.ok);

      const data = await response.json();
      console.log('📦 [CLIENT] Response data:', data);

      if (!data.success) {
        console.error('❌ [CLIENT] Request failed:', data.error);
        throw new Error(data.error || 'Failed to generate video');
      }

      if (data.cached) {
        setVideo(data.video);
        console.log('💾 [CLIENT] Video loaded from cache');
      } else {
        setVideo(data.video);
        console.log('🎥 [CLIENT] Video generation started, status:', data.video.status);

        if (data.video.status === 'generating') {
          console.log('⏳ [CLIENT] Starting to poll for video completion...');
          startPolling();
        } else if (data.video.status === 'failed') {
          console.warn('⚠️ [CLIENT] Video generation failed:', data.video.error_message);
        } else if (data.video.status === 'completed') {
          console.log('✅ [CLIENT] Video is ready!');
        }
      }

      return data.video;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to generate video';
      setError(errorMsg);
      console.error('❌ [CLIENT] FATAL ERROR:', err);
      console.error('❌ [CLIENT] Error details:', err.stack);
      return null;
    } finally {
      console.log('🏁 [CLIENT] generateVideo completed');
      setIsLoading(false);
    }
  };

  const pollVideoStatus = async () => {
    console.log('🔄 [CLIENT] Polling video status...');
    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/check-video-status?bookNumber=${bookNumber}&chapter=${chapter}`,
        {
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'apikey': supabaseAnonKey,
          },
        }
      );

      console.log('✅ [CLIENT] Poll response status:', response.status);
      const data = await response.json();
      console.log('📦 [CLIENT] Poll response data:', data);

      if (data.success && data.video) {
        setVideo(data.video);
        console.log('🎥 [CLIENT] Video status:', data.video.status);

        if (data.video.status === 'completed' || data.video.status === 'failed') {
          console.log('✅ [CLIENT] Video finished. Status:', data.video.status);
          return true;
        }
      }

      return false;
    } catch (err) {
      console.error('❌ [CLIENT] Error polling video status:', err);
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
    console.log('🔍 [CLIENT] Loading existing video...');
    setIsLoading(true);
    const existingVideo = await checkVideoStatus();
    if (existingVideo) {
      console.log('📼 [CLIENT] Found existing video:', existingVideo.status);
    } else {
      console.log('ℹ️ [CLIENT] No existing video found');
    }
    setVideo(existingVideo);
    setIsLoading(false);

    if (existingVideo?.status === 'generating') {
      console.log('⏳ [CLIENT] Video is generating, starting poll...');
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
