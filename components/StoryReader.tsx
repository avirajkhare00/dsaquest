'use client';

import { useState, useEffect } from 'react';
import type { StoryChapter } from '@/data/topics';

interface StoryReaderProps {
  chapters: StoryChapter[];
  topicColor: string;
  onChapterRead?: (chaptersRead: number, totalChapters: number) => void;
}

export default function StoryReader({ chapters, topicColor, onChapterRead }: StoryReaderProps) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const chapter = chapters[currentChapter];

  // Report progress whenever the chapter changes
  useEffect(() => {
    if (onChapterRead) {
      onChapterRead(currentChapter + 1, chapters.length);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChapter]);

  return (
    <div className="space-y-6">
      {/* Chapter navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {chapters.map((ch, i) => (
          <button
            key={ch.id}
            onClick={() => { setCurrentChapter(i); setShowCode(false); }}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              i === currentChapter
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'border border-gray-200 text-gray-600 hover:border-indigo-300 dark:border-slate-600 dark:text-slate-400 dark:hover:border-indigo-500'
            }`}
            style={i === currentChapter ? { background: topicColor } : {}}
          >
            <span>{ch.emoji}</span>
            <span className="hidden sm:block">{ch.title}</span>
            <span className="sm:hidden">Ch.{i + 1}</span>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--card-border)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${((currentChapter + 1) / chapters.length) * 100}%`,
            background: `linear-gradient(90deg, ${topicColor}, #6366f1)`,
          }}
        />
      </div>

      {/* Story card */}
      <div className="rounded-2xl border overflow-hidden shadow-sm"
        style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        {/* Chapter header */}
        <div className="px-6 py-4 border-b" style={{ background: 'var(--card-border)', borderColor: 'var(--card-border)' }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{chapter.emoji}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: topicColor }}>
                Chapter {currentChapter + 1} of {chapters.length}
              </p>
              <h3 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{chapter.title}</h3>
            </div>
          </div>
        </div>

        {/* Narrative */}
        <div className="p-6">
          <div className="prose prose-sm max-w-none">
            {chapter.narrative.split('\n\n').map((para, i) => (
              <p key={i} className="leading-relaxed mb-4 last:mb-0"
                style={{ color: 'var(--foreground)' }}
                dangerouslySetInnerHTML={{
                  __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }}
              />
            ))}
          </div>

          {/* Concept box */}
          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl dark:bg-indigo-950 dark:border-indigo-800">
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2">💡 The Core Concept</p>
            <p className="text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed">{chapter.concept}</p>
          </div>

          {/* Code toggle */}
          {chapter.codeExample && (
            <div className="mt-4">
              <button
                onClick={() => setShowCode(!showCode)}
                className="flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: 'var(--muted)' }}
              >
                <span className="text-lg">{showCode ? '📕' : '📖'}</span>
                {showCode ? 'Hide Code' : 'Show Code Example'}
              </button>

              {showCode && (
                <div className="mt-3 relative">
                  <pre className="bg-gray-950 text-gray-100 p-4 rounded-xl overflow-x-auto text-xs leading-relaxed font-mono dark:bg-slate-950">
                    <code>{chapter.codeExample}</code>
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Interview tip */}
          {chapter.tip && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl dark:bg-amber-950 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">{chapter.tip}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => { setCurrentChapter(p => p - 1); setShowCode(false); }}
          disabled={currentChapter === 0}
          className="flex-1 py-3 rounded-xl border font-medium disabled:opacity-40 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          style={{ borderColor: 'var(--card-border)', color: 'var(--muted)' }}
        >
          ← Previous
        </button>
        <button
          onClick={() => { setCurrentChapter(p => p + 1); setShowCode(false); }}
          disabled={currentChapter === chapters.length - 1}
          className="flex-1 py-3 rounded-xl text-white font-medium disabled:opacity-40 transition-colors shadow-md"
          style={{ background: topicColor }}
        >
          Next Chapter →
        </button>
      </div>

      {currentChapter === chapters.length - 1 && (
        <p className="text-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">
          ✅ All chapters read! Try the Visualizer and Quiz tabs.
        </p>
      )}
    </div>
  );
}
