'use client';

import { useState, useCallback } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getTopicBySlug } from '@/data/topics';
import { useProgress } from '@/hooks/useProgress';
import StoryReader from '@/components/StoryReader';
import QuizComponent from '@/components/QuizComponent';
import ArrayViz from '@/components/visualizers/ArrayViz';
import LinkedListViz from '@/components/visualizers/LinkedListViz';
import SortingViz from '@/components/visualizers/SortingViz';
import TreeViz from '@/components/visualizers/TreeViz';
import HashTableViz from '@/components/visualizers/HashTableViz';
import GraphViz from '@/components/visualizers/GraphViz';
import DPViz from '@/components/visualizers/DPViz';
import HeapViz from '@/components/visualizers/HeapViz';
import TrieViz from '@/components/visualizers/TrieViz';
import BacktrackingViz from '@/components/visualizers/BacktrackingViz';
import GreedyViz from '@/components/visualizers/GreedyViz';
import BitViz from '@/components/visualizers/BitViz';
import AdvancedGraphViz from '@/components/visualizers/AdvancedGraphViz';

type Tab = 'learn' | 'visualize' | 'quiz';

function getVisualizer(slug: string) {
  switch (slug) {
    case 'arrays':              return <ArrayViz />;
    case 'linked-lists':        return <LinkedListViz />;
    case 'sorting':             return <SortingViz />;
    case 'trees':               return <TreeViz />;
    case 'hash-tables':         return <HashTableViz />;
    case 'graphs':              return <GraphViz />;
    case 'dynamic-programming': return <DPViz />;
    case 'heaps':               return <HeapViz />;
    case 'tries':               return <TrieViz />;
    case 'backtracking':        return <BacktrackingViz />;
    case 'greedy':              return <GreedyViz />;
    case 'bit-manipulation':    return <BitViz />;
    case 'advanced-graphs':     return <AdvancedGraphViz />;
    default: return <p style={{ color: 'var(--muted)' }}>Visualizer coming soon!</p>;
  }
}

const difficultyColors: Record<string, string> = {
  Easy:   'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  Hard:   'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

export default function TopicPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const topic = getTopicBySlug(slug);
  const [activeTab, setActiveTab] = useState<Tab>('learn');
  const { markChapterRead, saveQuizScore, getTopicStatus, progress } = useProgress();

  if (!topic) return notFound();

  const topicProgress = progress[slug];
  const status = getTopicStatus(slug, topic.story.length);

  const handleChapterRead = useCallback((chaptersRead: number, total: number) => {
    markChapterRead(slug, chaptersRead);
    // If we just finished the last chapter, auto-advance hint
    void total;
  }, [slug, markChapterRead]);

  const handleQuizComplete = useCallback((score: number, total: number) => {
    saveQuizScore(slug, score, total);
  }, [slug, saveQuizScore]);

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'learn', label: 'Learn', emoji: '📖' },
    { id: 'visualize', label: 'Visualize', emoji: '🎮' },
    { id: 'quiz', label: 'Quiz', emoji: '🧠' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Topic hero */}
      <div className={`rounded-3xl bg-gradient-to-br ${topic.gradient} text-white p-8 shadow-xl`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-6xl">{topic.emoji}</div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                {topic.difficulty}
              </span>
              <span className="text-sm text-white/70">⏱️ {topic.timeToComplete}</span>
              {/* Progress badge */}
              {status === 'completed' && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/90 text-emerald-700">
                  ✅ Completed
                </span>
              )}
              {status === 'in-progress' && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/90 text-amber-700">
                  📖 In Progress
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black">{topic.title}</h1>
            <p className="text-white/80 mt-2 max-w-lg">{topic.description}</p>
          </div>
        </div>

        {/* Complexity table */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {topic.keyComplexities.map(({ operation, complexity }) => (
            <div key={operation} className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-white/70 leading-tight">{operation}</p>
              <p className="font-mono font-black text-base mt-0.5">{complexity}</p>
            </div>
          ))}
        </div>

        {/* Progress stats bar */}
        {topicProgress && (
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/80">
            <span>📖 {topicProgress.chaptersRead}/{topic.story.length} chapters read</span>
            {topicProgress.quizCompleted && (
              <span>🧠 Best quiz: {topicProgress.quizScore}/{topicProgress.quizTotal}</span>
            )}
          </div>
        )}
      </div>

      {/* Interview patterns with LeetCode links */}
      <div className="grid sm:grid-cols-3 gap-4">
        {topic.patterns.map(pattern => (
          <div key={pattern.name} className="rounded-2xl border p-4 shadow-sm"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>🎯 {pattern.name}</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>{pattern.description}</p>
            <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--card-border)' }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>Use cases</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400">{pattern.useCase}</p>
            </div>

            {/* LeetCode links */}
            {pattern.problems && pattern.problems.length > 0 && (
              <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--card-border)' }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--muted)' }}>
                  🔗 LeetCode
                </p>
                <div className="space-y-1.5">
                  {pattern.problems.map(problem => (
                    <a
                      key={problem.url}
                      href={problem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-lg transition-all hover:bg-indigo-50 dark:hover:bg-indigo-950 group"
                    >
                      <span className="text-gray-700 dark:text-slate-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 line-clamp-1 flex-1">
                        {problem.title}
                      </span>
                      <span className={`ml-2 flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-bold ${difficultyColors[problem.difficulty] ?? difficultyColors.Medium}`}>
                        {problem.difficulty}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="rounded-2xl border shadow-sm overflow-hidden"
        style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        {/* Tab bar */}
        <div className="flex border-b" style={{ borderColor: 'var(--card-border)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'border-b-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                  : 'hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
              style={activeTab === tab.id
                ? { borderBottomColor: topic.color, color: topic.color }
                : { color: 'var(--muted)' }}
            >
              <span className="text-base">{tab.emoji}</span>
              <span className="hidden sm:block">{tab.label}</span>
              {/* Tab progress indicator */}
              {tab.id === 'learn' && topicProgress && topicProgress.chaptersRead > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 font-bold">
                  {topicProgress.chaptersRead}/{topic.story.length}
                </span>
              )}
              {tab.id === 'quiz' && topicProgress?.quizCompleted && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 font-bold">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'learn' && (
            <StoryReader
              chapters={topic.story}
              topicColor={topic.color}
              onChapterRead={handleChapterRead}
            />
          )}
          {activeTab === 'visualize' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>🎮 Interactive Visualizer</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                  Use the controls below to explore how {topic.title} works step by step.
                </p>
              </div>
              {getVisualizer(slug)}
            </div>
          )}
          {activeTab === 'quiz' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>🧠 Test Your Knowledge</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                  {topic.quiz.length} interview-style questions about {topic.title}. Aim for 4/5!
                </p>
              </div>
              <QuizComponent
                questions={topic.quiz}
                topicColor={topic.color}
                onComplete={handleQuizComplete}
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 pb-8">
        <a href="/topics" className="flex items-center gap-2 text-sm transition-colors hover:text-indigo-600" style={{ color: 'var(--muted)' }}>
          ← All Topics
        </a>
        <div className="text-sm" style={{ color: 'var(--muted)' }}>
          💡 Tip: Complete all 3 tabs to master this topic!
        </div>
      </div>
    </div>
  );
}
