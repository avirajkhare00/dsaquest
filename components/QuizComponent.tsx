'use client';

import { useState } from 'react';
import type { QuizQuestion } from '@/data/topics';

interface QuizComponentProps {
  questions: QuizQuestion[];
  topicColor: string;
}

export default function QuizComponent({ questions, topicColor }: QuizComponentProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);

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
      setShowResults(true);
    }
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
  }

  const score = answers.filter((a, i) => a === questions[i].correctIndex).length;

  if (showResults) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="space-y-6 text-center">
        <div className="text-6xl">{pct >= 80 ? '🎉' : pct >= 60 ? '😊' : '📚'}</div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Quiz Complete!</h3>
          <p className="text-gray-600 mt-2">You scored {score}/{questions.length} ({pct}%)</p>
        </div>

        {/* Score bar */}
        <div className="max-w-xs mx-auto">
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444' }}
            />
          </div>
        </div>

        {/* Per-question review */}
        <div className="text-left space-y-3 max-w-lg mx-auto">
          {questions.map((q, i) => (
            <div key={q.id} className={`p-4 rounded-xl border ${answers[i] === q.correctIndex ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-2">
                <span className="text-lg">{answers[i] === q.correctIndex ? '✅' : '❌'}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{q.question}</p>
                  {answers[i] !== q.correctIndex && (
                    <p className="text-xs text-gray-600 mt-1">
                      Your answer: <span className="text-red-600">{q.options[answers[i] ?? 0]}</span><br />
                      Correct: <span className="text-green-600">{q.options[q.correctIndex]}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={restart}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
          🔄 Try Again
        </button>

        {pct >= 80 && (
          <p className="text-emerald-600 font-medium">🌟 Excellent! You've mastered this topic. Move on to the next one!</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all ${
              i === current ? 'w-6 bg-indigo-500' :
              answers[i] !== null ? (answers[i] === questions[i].correctIndex ? 'w-2 bg-green-400' : 'w-2 bg-red-400') :
              'w-2 bg-gray-200'
            }`} />
          ))}
        </div>
        <span className="text-xs text-gray-500">{current + 1} / {questions.length}</span>
      </div>

      {/* Question */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <p className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-3">Question {current + 1}</p>
        <p className="text-base font-semibold text-gray-900 leading-relaxed">{q.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {q.options.map((opt, i) => {
          let style = 'bg-white border-gray-200 text-gray-800 hover:border-indigo-300 hover:bg-indigo-50';
          if (isAnswered) {
            if (i === q.correctIndex) style = 'bg-green-50 border-green-400 text-green-800';
            else if (i === answers[current]) style = 'bg-red-50 border-red-400 text-red-800';
            else style = 'bg-white border-gray-200 text-gray-400';
          }
          return (
            <button
              key={i}
              onClick={() => selectAnswer(i)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-sm ${style}`}
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

      {/* Explanation (shown after answering) */}
      {isAnswered && (
        <div className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
          <p className="text-xs font-bold mb-1 uppercase tracking-wide">
            {isCorrect ? '✅ Correct!' : '💡 Explanation'}
          </p>
          <p className="text-sm text-gray-700">{q.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {isAnswered && (
        <button onClick={next}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
          {current < questions.length - 1 ? 'Next Question →' : 'See Results 🎉'}
        </button>
      )}
    </div>
  );
}
