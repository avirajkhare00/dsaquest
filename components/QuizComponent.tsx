'use client';

import { useState } from 'react';
import type { QuizQuestion } from '@/data/topics';

interface QuizComponentProps {
  questions: QuizQuestion[];
  topicColor: string;
  onComplete?: (score: number, total: number) => void;
}

export default function QuizComponent({ questions, topicColor, onComplete }: QuizComponentProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [resultsSaved, setResultsSaved] = useState(false);

  const q = questions[current];
  const isAnswered = answers[current] !== null;
  const isCorrect = answers[current] === q.correctIndex;

  function selectAnswer(idx: number) {
    if (isAnswered) return;
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
    setSelected(idx);
  }

  function next() {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(answers[current + 1]);
    } else {
      const finalScore = answers.filter((a, i) => a === questions[i].correctIndex).length;
      setShowResults(true);
      if (onComplete && !resultsSaved) {
        onComplete(finalScore, questions.length);
        setResultsSaved(true);
      }
    }
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
    setResultsSaved(false);
  }

  const score = answers.filter((a, i) => a === questions[i].correctIndex).length;

  if (showResults) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="space-y-6 text-center">
        <div className="text-6xl">{pct >= 80 ? '🎉' : pct >= 60 ? '😊' : '📚'}</div>
        <div>
          <h3 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Quiz Complete!</h3>
          <p className="mt-2" style={{ color: 'var(--muted)' }}>You scored {score}/{questions.length} ({pct}%)</p>
        </div>

        {/* Score bar */}
        <div className="max-w-xs mx-auto">
          <div className="h-4 rounded-full overflow-hidden" style={{ background: 'var(--card-border)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444' }}
            />
          </div>
        </div>

        {pct >= 80 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full dark:bg-emerald-950 dark:border-emerald-700">
            <span>⭐</span>
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Progress saved!</span>
          </div>
        )}

        {/* Per-question review */}
        <div className="text-left space-y-3 max-w-lg mx-auto">
          {questions.map((q, i) => (
            <div key={q.id} className={`p-4 rounded-xl border ${answers[i] === q.correctIndex ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'}`}>
              <div className="flex items-start gap-2">
                <span className="text-lg">{answers[i] === q.correctIndex ? '✅' : '❌'}</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{q.question}</p>
                  {answers[i] !== q.correctIndex && (
                    <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                      Your answer: <span className="text-red-600 dark:text-red-400">{q.options[answers[i] ?? 0]}</span><br />
                      Correct: <span className="text-green-600 dark:text-green-400">{q.options[q.correctIndex]}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={restart}
          className="px-6 py-3 text-white rounded-xl font-semibold transition-colors shadow-md"
          style={{ background: topicColor }}>
          🔄 Try Again
        </button>

        {pct >= 80 && (
          <p className="text-emerald-600 dark:text-emerald-400 font-medium">🌟 Excellent! You&apos;ve mastered this topic. Move on to the next one!</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress dots */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all ${
              i === current ? 'w-6 bg-indigo-500' :
              answers[i] !== null ? (answers[i] === questions[i].correctIndex ? 'w-2 bg-green-400' : 'w-2 bg-red-400') :
              'w-2 bg-gray-200 dark:bg-slate-600'
            }`} />
          ))}
        </div>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{current + 1} / {questions.length}</span>
      </div>

      {/* Question */}
      <div className="border rounded-2xl p-6 shadow-sm" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: topicColor }}>Question {current + 1}</p>
        <p className="text-base font-semibold leading-relaxed" style={{ color: 'var(--foreground)' }}>{q.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {q.options.map((opt, i) => {
          let cls = 'border-gray-200 dark:border-slate-600 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950';
          if (isAnswered) {
            if (i === q.correctIndex) cls = 'bg-green-50 border-green-400 dark:bg-green-950 dark:border-green-600';
            else if (i === answers[current]) cls = 'bg-red-50 border-red-400 dark:bg-red-950 dark:border-red-600';
            else cls = 'border-gray-200 dark:border-slate-700 opacity-50';
          }
          return (
            <button
              key={i}
              onClick={() => selectAnswer(i)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-sm ${cls}`}
              style={{ background: isAnswered ? undefined : 'var(--card-bg)', color: 'var(--foreground)' }}
            >
              <span className="inline-flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border-2 ${
                  isAnswered && i === q.correctIndex ? 'bg-green-500 border-green-500 text-white' :
                  isAnswered && i === answers[current] && i !== q.correctIndex ? 'bg-red-500 border-red-500 text-white' :
                  'border-current'
                }`}>
                  {isAnswered && i === q.correctIndex ? '✓' : isAnswered && i === answers[current] ? '✗' : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isAnswered && (
        <div className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : 'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800'}`}>
          <p className="text-xs font-bold mb-1 uppercase tracking-wide" style={{ color: 'var(--foreground)' }}>
            {isCorrect ? '✅ Correct!' : '💡 Explanation'}
          </p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{q.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {isAnswered && (
        <button onClick={next}
          className="w-full py-3 text-white rounded-xl font-semibold transition-colors shadow-md"
          style={{ background: topicColor }}>
          {current < questions.length - 1 ? 'Next Question →' : 'See Results 🎉'}
        </button>
      )}
    </div>
  );
}
