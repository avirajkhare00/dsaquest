'use client';

import { useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import TopicCard from '@/components/TopicCard';
import type { Topic } from '@/data/topics';

interface TopicsGridProps {
  topics: Topic[];
}

export default function TopicsGrid({ topics }: TopicsGridProps) {
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState<string>('All');
  const { getTopicStatus, totalCompleted, loaded } = useProgress();

  const filtered = topics.filter(t => {
    const matchSearch =
      search.trim() === '' ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.patterns.some(p => p.name.toLowerCase().includes(search.toLowerCase()));
    const matchDiff = diffFilter === 'All' || t.difficulty === diffFilter;
    return matchSearch && matchDiff;
  });

  return (
    <div className="space-y-8">
      {/* Progress summary */}
      {loaded && totalCompleted > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl border"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="text-2xl">🏆</div>
          <div>
            <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>
              {totalCompleted} of {topics.length} topics completed
            </p>
            <div className="mt-1.5 h-2 rounded-full w-48 overflow-hidden" style={{ background: 'var(--card-border)' }}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-700"
                style={{ width: `${(totalCompleted / topics.length) * 100}%` }}
              />
            </div>
          </div>
          <span className="ml-auto text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {Math.round((totalCompleted / topics.length) * 100)}%
          </span>
        </div>
      )}

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }}
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search topics, patterns…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            style={{
              background: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--foreground)',
            }}
          />
        </div>

        {/* Difficulty filter */}
        <div className="flex gap-2 flex-wrap">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(d => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                diffFilter === d
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-200 dark:border-slate-600'
              }`}
              style={diffFilter !== d ? { background: 'var(--card-bg)', color: 'var(--muted)' } : {}}
            >
              {d}
              {d !== 'All' && (
                <span className={`ml-1.5 text-xs font-bold ${diffFilter === d ? 'text-white/70' : ''}`}>
                  {topics.filter(t => t.difficulty === d).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Topics grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((topic, i) => {
            const status = loaded ? getTopicStatus(topic.slug, topic.story.length) : 'not-started';
            return <TopicCard key={topic.slug} topic={topic} index={i} status={status} />;
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>No topics match &ldquo;{search}&rdquo;</p>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Try a different keyword or clear the filter.</p>
          <button
            onClick={() => { setSearch(''); setDiffFilter('All'); }}
            className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 transition-all">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
