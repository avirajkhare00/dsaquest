'use client';

import { useState } from 'react';
import type { StoryChapter } from '@/data/topics';

interface StoryReaderProps {
  chapters: StoryChapter[];
  topicColor: string;
}

export default function StoryReader({ chapters, topicColor }: StoryReaderProps) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const chapter = chapters[currentChapter];

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
                : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
            }`}
          >
            <span>{ch.emoji}</span>
            <span className="hidden sm:block">{ch.title}</span>
            <span className="sm:hidden">Ch.{i + 1}</span>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${((currentChapter + 1) / chapters.length) * 100}%` }}
        />
      </div>

      {/* Story card */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {/* Chapter header */}
        <div className="bg-gradient-to-r from-slate-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{chapter.emoji}</span>
            <div>
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">
                Chapter {currentChapter + 1} of {chapters.length}
              </p>
              <h3 className="text-lg font-bold text-gray-900">{chapter.title}</h3>
            </div>
          </div>
        </div>

        {/* Narrative */}
        <div className="p-6">
          <div className="prose prose-sm max-w-none">
            {chapter.narrative.split('\n\n').map((para, i) => (
              <p key={i} className="text-gray-700 leading-relaxed mb-4 last:mb-0"
                dangerouslySetInnerHTML={{
                  __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>')
                }}
              />
            ))}
          </div>

          {/* Concept box */}
          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">💡 The Core Concept</p>
            <p className="text-sm text-indigo-900 leading-relaxed">{chapter.concept}</p>
          </div>

          {/* Code toggle */}
          {chapter.codeExample && (
            <div className="mt-4">
              <button
                onClick={() => setShowCode(!showCode)}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span className="text-lg">{showCode ? '📕' : '📖'}</span>
                {showCode ? 'Hide Code' : 'Show Code Example'}
              </button>

              {showCode && (
                <div className="mt-3 relative">
                  <pre className="bg-gray-950 text-gray-100 p-4 rounded-xl overflow-x-auto text-xs leading-relaxed font-mono">
                    <code>{chapter.codeExample}</code>
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Interview tip */}
          {chapter.tip && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-sm text-amber-800 leading-relaxed">{chapter.tip}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => { setCurrentChapter(p => p - 1); setShowCode(false); }}
          disabled={currentChapter === 0}
          className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={() => { setCurrentChapter(p => p + 1); setShowCode(false); }}
          disabled={currentChapter === chapters.length - 1}
          className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-medium disabled:opacity-40 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
        >
          Next Chapter →
        </button>
      </div>

      {currentChapter === chapters.length - 1 && (
        <p className="text-center text-sm text-emerald-600 font-medium">
          ✅ Chapter complete! Try the Visualizer and Quiz tabs.
        </p>
      )}
    </div>
  );
}
