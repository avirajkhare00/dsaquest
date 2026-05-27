'use client';

import { useState } from 'react';

const COLORS = {
  default: { bg: '#e0e7ff', border: '#6366f1', text: '#4338ca' },
  highlight: { bg: '#fde68a', border: '#f59e0b', text: '#92400e' },
  found: { bg: '#d1fae5', border: '#10b981', text: '#065f46' },
  leftPtr: { bg: '#fce7f3', border: '#ec4899', text: '#9d174d' },
  rightPtr: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
  window: { bg: '#ede9fe', border: '#8b5cf6', text: '#5b21b6' },
};

type Mode = 'access' | 'search' | 'two-pointer' | 'sliding-window';

const INITIAL_ARRAY = [3, 7, 1, 9, 4, 6, 2, 8, 5];

export default function ArrayViz() {
  const [arr] = useState(INITIAL_ARRAY);
  const [mode, setMode] = useState<Mode>('access');
  const [step, setStep] = useState<null | { type: string; indices: number[]; message: string }>(null);
  const [targetIdx, setTargetIdx] = useState(4);
  const [searchVal, setSearchVal] = useState(6);
  const [tpTarget, setTpTarget] = useState(10);
  const [windowSize, setWindowSize] = useState(3);
  const [tpResult, setTpResult] = useState<[number, number] | null>(null);
  const [windowResult, setWindowResult] = useState<{ start: number; sum: number } | null>(null);
  const [animating, setAnimating] = useState(false);
  const [steps, setSteps] = useState<{ type: string; indices: number[]; message: string }[]>([]);
  const [stepIdx, setStepIdx] = useState(0);

  const sortedArr = [...INITIAL_ARRAY].sort((a, b) => a - b);

  function getColor(i: number) {
    if (!step) return COLORS.default;
    const { type, indices } = step;
    if (type === 'access' && indices[0] === i) return COLORS.found;
    if (type === 'search-check' && indices[0] === i) return COLORS.highlight;
    if (type === 'search-found' && indices[0] === i) return COLORS.found;
    if (type === 'left' && indices[0] === i) return COLORS.leftPtr;
    if (type === 'right' && indices[0] === i) return COLORS.rightPtr;
    if (type === 'both' && indices.includes(i)) return COLORS.found;
    if (type === 'window') {
      if (i >= indices[0] && i <= indices[1]) return COLORS.window;
    }
    return COLORS.default;
  }

  function runAccess() {
    setSteps([]);
    setStep({ type: 'access', indices: [targetIdx], message: `⚡ Accessing index ${targetIdx} → value is ${arr[targetIdx]}. O(1) instant!` });
  }

  function runSearch() {
    const newSteps: typeof steps = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === searchVal) {
        newSteps.push({ type: 'search-found', indices: [i], message: `✅ Found ${searchVal} at index ${i}! Checked ${i + 1} elements.` });
        break;
      }
      newSteps.push({ type: 'search-check', indices: [i], message: `🔍 Checking index ${i}: ${arr[i]} ≠ ${searchVal}` });
    }
    if (!newSteps.some(s => s.type === 'search-found')) {
      newSteps.push({ type: 'search-check', indices: [-1], message: `❌ ${searchVal} not found after checking all elements.` });
    }
    setSteps(newSteps);
    setStepIdx(0);
    setStep(newSteps[0]);
  }

  function runTwoPointer() {
    const sorted = sortedArr;
    const newSteps: typeof steps = [];
    let l = 0, r = sorted.length - 1;
    setTpResult(null);
    while (l < r) {
      const sum = sorted[l] + sorted[r];
      if (sum === tpTarget) {
        newSteps.push({ type: 'both', indices: [l, r], message: `✅ Found! sorted[${l}]=${sorted[l]} + sorted[${r}]=${sorted[r]} = ${tpTarget}` });
        setTpResult([l, r]);
        break;
      } else if (sum < tpTarget) {
        newSteps.push({ type: 'left', indices: [l, r], message: `⬅️ Sum ${sum} < ${tpTarget}, move left pointer right` });
        l++;
      } else {
        newSteps.push({ type: 'right', indices: [l, r], message: `➡️ Sum ${sum} > ${tpTarget}, move right pointer left` });
        r--;
      }
    }
    if (!newSteps.some(s => s.type === 'both')) {
      newSteps.push({ type: 'search-check', indices: [], message: `❌ No pair sums to ${tpTarget}` });
    }
    setSteps(newSteps);
    setStepIdx(0);
    setStep(newSteps[0]);
  }

  function runSlidingWindow() {
    const k = windowSize;
    const newSteps: typeof steps = [];
    let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);
    let maxSum = windowSum;
    let maxStart = 0;
    newSteps.push({ type: 'window', indices: [0, k - 1], message: `Initial window [0..${k-1}]: sum = ${windowSum}` });
    for (let i = k; i < arr.length; i++) {
      windowSum += arr[i] - arr[i - k];
      if (windowSum > maxSum) { maxSum = windowSum; maxStart = i - k + 1; }
      newSteps.push({ type: 'window', indices: [i - k + 1, i], message: `Window [${i-k+1}..${i}]: sum = ${windowSum}${windowSum === maxSum ? ' ← NEW MAX!' : ''}` });
    }
    setWindowResult({ start: maxStart, sum: maxSum });
    setSteps(newSteps);
    setStepIdx(0);
    setStep(newSteps[0]);
  }

  const displayArr = mode === 'two-pointer' ? sortedArr : arr;

  function prevStep() {
    if (stepIdx > 0) { setStepIdx(p => p - 1); setStep(steps[stepIdx - 1]); }
  }
  function nextStep() {
    if (stepIdx < steps.length - 1) { setStepIdx(p => p + 1); setStep(steps[stepIdx + 1]); }
  }

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="flex flex-wrap gap-2">
        {(['access', 'search', 'two-pointer', 'sliding-window'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setStep(null); setSteps([]); setStepIdx(0); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              mode === m ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {m === 'access' ? '⚡ Access' : m === 'search' ? '🔍 Search' : m === 'two-pointer' ? '👆👆 Two Pointers' : '🪟 Sliding Window'}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap gap-4 items-end">
        {mode === 'access' && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Index (0–{arr.length - 1})</label>
            <input type="number" min={0} max={arr.length - 1} value={targetIdx}
              onChange={e => setTargetIdx(Number(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400"
            />
          </div>
        )}
        {mode === 'search' && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Search for value</label>
            <input type="number" value={searchVal}
              onChange={e => setSearchVal(Number(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400"
            />
          </div>
        )}
        {mode === 'two-pointer' && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Target sum</label>
            <input type="number" value={tpTarget}
              onChange={e => setTpTarget(Number(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400"
            />
          </div>
        )}
        {mode === 'sliding-window' && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Window size (k)</label>
            <input type="number" min={1} max={arr.length} value={windowSize}
              onChange={e => setWindowSize(Math.min(arr.length, Math.max(1, Number(e.target.value))))}
              className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400"
            />
          </div>
        )}
        <button
          onClick={() => {
            setStep(null); setSteps([]); setStepIdx(0);
            if (mode === 'access') runAccess();
            else if (mode === 'search') runSearch();
            else if (mode === 'two-pointer') runTwoPointer();
            else runSlidingWindow();
          }}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
        >
          ▶ Run
        </button>
      </div>

      {/* Array visualization */}
      <div>
        {mode === 'two-pointer' && (
          <p className="text-xs text-gray-500 mb-2">* Array sorted for Two Pointers: [{sortedArr.join(', ')}]</p>
        )}
        <div className="flex gap-2 flex-wrap">
          {displayArr.map((val, i) => {
            const c = getColor(i);
            const isLeftPtr = step?.type === 'left' && step.indices[0] === i;
            const isRightPtr = step?.type === 'right' && step.indices[0] === i;
            const isBoth = step?.type === 'both' && step.indices.includes(i);
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="viz-box w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border-2 transition-all duration-300"
                  style={{ backgroundColor: c.bg, borderColor: c.border, color: c.text }}
                >
                  {val}
                </div>
                <span className="text-xs text-gray-400 font-mono">{i}</span>
                {/* Pointer labels */}
                {isLeftPtr && <span className="text-xs text-pink-500 font-bold">L</span>}
                {isRightPtr && <span className="text-xs text-blue-500 font-bold">R</span>}
                {isBoth && <span className="text-xs text-emerald-600 font-bold">✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step message */}
      {step && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-800 font-medium">{step.message}</p>
          {steps.length > 1 && (
            <div className="mt-3 flex items-center gap-3">
              <button onClick={prevStep} disabled={stepIdx === 0}
                className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200 transition-colors">
                ← Prev
              </button>
              <span className="text-xs text-gray-500">Step {stepIdx + 1} / {steps.length}</span>
              <button onClick={nextStep} disabled={stepIdx === steps.length - 1}
                className="px-3 py-1.5 text-xs bg-indigo-100 text-indigo-700 rounded-lg disabled:opacity-40 hover:bg-indigo-200 transition-colors">
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { color: COLORS.default, label: 'Default' },
          { color: COLORS.highlight, label: 'Checking' },
          { color: COLORS.found, label: 'Found / Match' },
          { color: COLORS.leftPtr, label: 'Left Pointer' },
          { color: COLORS.rightPtr, label: 'Right Pointer' },
          { color: COLORS.window, label: 'Window' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border-2" style={{ backgroundColor: color.bg, borderColor: color.border }} />
            <span className="text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
