'use client';

import { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getTopicBySlug } from '@/data/topics';
import StoryReader from '@/components/StoryReader';
import QuizComponent from '@/components/QuizComponent';
import ArrayViz from '@/components/visualizers/ArrayViz';
import LinkedListViz from '@/components/visualizers/LinkedListViz';
import SortingViz from '@/components/visualizers/SortingViz';
import TreeViz from '@/components/visualizers/TreeViz';

type Tab = 'learn' | 'visualize' | 'quiz';

function getVisualizer(slug: string) {
  switch (slug) {
    case 'arrays': return <ArrayViz />;
    case 'linked-lists': return <LinkedListViz />;
    case 'sorting': return <SortingViz />;
    case 'trees': return <TreeViz />;
    default: return <p className="text-gray-500">Visualizer coming soon!</p>;
  }
}

export default function TopicPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const topic = getTopicBySlug(slug);
  const [activeTab, setActiveTab] = useState<Tab>('learn');

  if (!topic) return notFound();

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'learn', label: 'Learn', emoji: '📖' },
    { id: 'visualize', label: 'Visualize', emoji: '🎮' },
    { id: 'quiz', label: 'Quiz', emoji: '🧠' },
  ];

  const difficultyColors = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-amber-100 text-amber-700',
    Advanced: 'bg-red-100 text-red-700',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Topic hero */}
      <div className={`rounded-3xl bg-gradient-to-br ${topic.gradient} text-white p-8 shadow-xl`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-6xl">{topic.emoji}</div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm`}>
                {topic.difficulty}
              </span>
              <span className="text-sm text-white/70">⏱️ {topic.timeToComplete}</span>
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
      </div>

      {/* Interview patterns */}
      <div className="grid sm:grid-cols-3 gap-4">
        {topic.patterns.map(pattern => (
          <div key={pattern.name} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="font-bold text-gray-900 text-sm">🎯 {pattern.name}</p>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">{pattern.description}</p>
            <div className="mt-3 pt-3 border-t border-gray-50">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Use cases</p>
              <p className="text-xs text-indigo-600 mt-1">{pattern.useCase}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? `border-b-2 text-indigo-600 bg-indigo-50/50`
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              style={activeTab === tab.id ? { borderBottomColor: topic.color } : {}}
            >
              <span className="text-base">{tab.emoji}</span>
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'learn' && (
            <StoryReader chapters={topic.story} topicColor={topic.color} />
          )}
          {activeTab === 'visualize' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">🎮 Interactive Visualizer</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Use the controls below to explore how {topic.title} works step by step.
                </p>
              </div>
              {getVisualizer(slug)}
            </div>
          )}
          {activeTab === 'quiz' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">🧠 Test Your Knowledge</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {topic.quiz.length} interview-style questions about {topic.title}. Aim for 4/5!
                </p>
              </div>
              <QuizComponent questions={topic.quiz} topicColor={topic.color} />
            </div>
          )}
        </div>
      </div>

      {/* Navigation to next topic */}
      <div className="flex justify-between items-center pt-4 pb-8">
        <a href="/topics" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          ← All Topics
        </a>
        <div className="text-sm text-gray-500">
          💡 Tip: Complete all 3 tabs to master this topic!
        </div>
      </div>
    </div>
  );
}
