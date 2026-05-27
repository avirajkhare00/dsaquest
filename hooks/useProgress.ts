'use client';
import { useState, useEffect, useCallback } from 'react';

export interface TopicProgress {
  chaptersRead: number;   // count of chapters read
  quizScore: number;      // best score out of total
  quizTotal: number;
  quizCompleted: boolean;
  lastVisited: number;    // timestamp
}

export type ProgressMap = Record<string, TopicProgress>;

const STORAGE_KEY = 'dsaquest_progress';

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProgress(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  const save = useCallback((next: ProgressMap) => {
    setProgress(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const markChapterRead = useCallback((slug: string, chapterCount: number) => {
    setProgress(prev => {
      const cur = prev[slug] ?? { chaptersRead: 0, quizScore: 0, quizTotal: 0, quizCompleted: false, lastVisited: 0 };
      const next = { ...prev, [slug]: { ...cur, chaptersRead: chapterCount, lastVisited: Date.now() } };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const saveQuizScore = useCallback((slug: string, score: number, total: number) => {
    setProgress(prev => {
      const cur = prev[slug] ?? { chaptersRead: 0, quizScore: 0, quizTotal: total, quizCompleted: false, lastVisited: 0 };
      const next = {
        ...prev,
        [slug]: {
          ...cur,
          quizScore: Math.max(cur.quizScore, score),
          quizTotal: total,
          quizCompleted: true,
          lastVisited: Date.now(),
        },
      };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    save({});
  }, [save]);

  const getTopicStatus = useCallback((slug: string, totalChapters: number) => {
    const p = progress[slug];
    if (!p) return 'not-started' as const;
    if (p.quizCompleted && p.chaptersRead >= totalChapters) return 'completed' as const;
    return 'in-progress' as const;
  }, [progress]);

  const totalCompleted = Object.values(progress).filter(p => p.quizCompleted).length;

  return { progress, loaded, markChapterRead, saveQuizScore, resetProgress, getTopicStatus, totalCompleted };
}
