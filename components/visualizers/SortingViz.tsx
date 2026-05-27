'use client';

import { useState, useEffect, useRef } from 'react';

type Algorithm = 'bubble' | 'merge' | 'quick';

interface SortStep {
  arr: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  pivot?: number;
  merged?: [number, number]; // [start, end] of merged range
  message: string;
}

function generateBubbleSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sorted: number[] = [];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ arr: [...arr], comparing: [j, j + 1], swapping: [], sorted: [...sorted], message: `Comparing arr[${j}]=${arr[j]} and arr[${j+1}]=${arr[j+1]}` });
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({ arr: [...arr], comparing: [], swapping: [j, j + 1], sorted: [...sorted], message: `Swapped! arr[${j}]=${arr[j]} ↔ arr[${j+1}]=${arr[j+1]}` });
        swapped = true;
      }
    }
    sorted.push(n - 1 - i);
    if (!swapped) {
      for (let k = 0; k < n - i - 1; k++) sorted.push(k);
      break;
    }
  }
  sorted.push(0);
  steps.push({ arr: [...arr], comparing: [], swapping: [], sorted: arr.map((_, i) => i), message: '✅ Sorted!' });
  return steps;
}

function generateMergeSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sorted: number[] = [];

  function merge(a: number[], l: number, m: number, r: number) {
    const left = a.slice(l, m + 1);
    const right = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      steps.push({ arr: [...a], comparing: [l + i, m + 1 + j], swapping: [], sorted: [...sorted], merged: [l, r], message: `Comparing left[${i}]=${left[i]} vs right[${j}]=${right[j]}` });
      if (left[i] <= right[j]) { a[k++] = left[i++]; }
      else { a[k++] = right[j++]; }
    }
    while (i < left.length) a[k++] = left[i++];
    while (j < right.length) a[k++] = right[j++];
    steps.push({ arr: [...a], comparing: [], swapping: [], sorted: [...sorted], merged: [l, r], message: `Merged range [${l}..${r}]: [${a.slice(l, r+1).join(', ')}]` });
    for (let x = l; x <= r; x++) if (!sorted.includes(x)) sorted.push(x);
  }

  function mergeSort(a: number[], l: number, r: number) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    mergeSort(a, l, m);
    mergeSort(a, m + 1, r);
    merge(a, l, m, r);
  }

  mergeSort(arr, 0, arr.length - 1);
  steps.push({ arr: [...arr], comparing: [], swapping: [], sorted: arr.map((_, i) => i), message: '✅ Sorted with Merge Sort!' });
  return steps;
}

function generateQuickSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sortedSet = new Set<number>();

  function partition(a: number[], low: number, high: number): number {
    const pivot = a[high];
    steps.push({ arr: [...a], comparing: [], swapping: [], sorted: [...sortedSet], pivot: high, message: `Pivot selected: ${pivot} (at index ${high})` });
    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({ arr: [...a], comparing: [j, high], swapping: [], sorted: [...sortedSet], pivot: high, message: `Comparing arr[${j}]=${a[j]} with pivot=${pivot}` });
      if (a[j] <= pivot) {
        i++;
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          steps.push({ arr: [...a], comparing: [], swapping: [i, j], sorted: [...sortedSet], pivot: high, message: `Swapped arr[${i}]=${a[i]} ↔ arr[${j}]=${a[j]}` });
        }
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    sortedSet.add(i + 1);
    steps.push({ arr: [...a], comparing: [], swapping: [i + 1, high], sorted: [...sortedSet], pivot: i + 1, message: `Pivot ${pivot} placed at index ${i + 1} — its FINAL position!` });
    return i + 1;
  }

  function quickSort(a: number[], low: number, high: number) {
    if (low < high) {
      const pi = partition(a, low, high);
      quickSort(a, low, pi - 1);
      quickSort(a, pi + 1, high);
    } else if (low === high) {
      sortedSet.add(low);
    }
  }

  quickSort(arr, 0, arr.length - 1);
  steps.push({ arr: [...arr], comparing: [], swapping: [], sorted: arr.map((_, i) => i), message: '✅ Sorted with Quick Sort!' });
  return steps;
}

const INITIAL_ARR = [6, 3, 8, 1, 7, 2, 9, 4, 5];
const MAX_VAL = 9;

export default function SortingViz() {
  const [algo, setAlgo] = useState<Algorithm>('bubble');
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(400);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStep = steps[stepIdx] ?? { arr: INITIAL_ARR, comparing: [], swapping: [], sorted: [], message: 'Press ▶ Play to start sorting!' };

  useEffect(() => {
    setSteps([]); setStepIdx(0); setIsPlaying(false);
  }, [algo]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setStepIdx(prev => {
          if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, speed);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, steps, speed]);

  function generate() {
    const newSteps = algo === 'bubble' ? generateBubbleSteps([...INITIAL_ARR])
      : algo === 'merge' ? generateMergeSteps([...INITIAL_ARR])
      : generateQuickSteps([...INITIAL_ARR]);
    setSteps(newSteps); setStepIdx(0); setIsPlaying(false);
  }

  function getBarStyle(i: number, val: number) {
    const height = `${(val / MAX_VAL) * 100}%`;
    const { comparing, swapping, sorted, pivot } = currentStep;
    let bg = '#a5b4fc'; // default indigo
    let border = '#6366f1';

    if (sorted.includes(i)) { bg = '#6ee7b7'; border = '#10b981'; }
    if (comparing.includes(i)) { bg = '#fde68a'; border = '#f59e0b'; }
    if (swapping.includes(i)) { bg = '#fca5a5'; border = '#ef4444'; }
    if (i === pivot) { bg = '#c4b5fd'; border = '#8b5cf6'; }

    return { height, backgroundColor: bg, borderColor: border, borderWidth: '2px', borderStyle: 'solid', borderRadius: '4px 4px 0 0', transition: 'all 0.15s ease' };
  }

  const algoInfo = {
    bubble: { name: 'Bubble Sort', complexity: 'O(n²)', color: 'indigo', desc: 'Repeatedly swap adjacent elements if they\'re in wrong order' },
    merge: { name: 'Merge Sort', complexity: 'O(n log n)', color: 'emerald', desc: 'Divide array in half, sort recursively, merge sorted halves' },
    quick: { name: 'Quick Sort', complexity: 'O(n log n) avg', color: 'purple', desc: 'Pick a pivot, partition smaller left / larger right, recurse' },
  };

  return (
    <div className="space-y-6">
      {/* Algorithm selector */}
      <div className="flex flex-wrap gap-2">
        {(['bubble', 'merge', 'quick'] as Algorithm[]).map(a => (
          <button key={a} onClick={() => setAlgo(a)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${algo === a ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {algoInfo[a].name} <span className="opacity-70 text-xs">({algoInfo[a].complexity})</span>
          </button>
        ))}
      </div>

      {/* Algorithm info */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
        <p className="text-sm font-semibold text-amber-800">{algoInfo[algo].name}</p>
        <p className="text-sm text-amber-700 mt-1">{algoInfo[algo].desc}</p>
        <p className="text-xs text-amber-600 mt-1">Complexity: <strong>{algoInfo[algo].complexity}</strong></p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={generate}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors shadow-md shadow-amber-200">
          🔀 Generate Steps
        </button>
        {steps.length > 0 && (
          <>
            <button onClick={() => setIsPlaying(p => !p)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isPlaying ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <button onClick={() => setStepIdx(p => Math.max(0, p - 1))} disabled={stepIdx === 0}
              className="px-3 py-2 bg-gray-100 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-200">◀</button>
            <button onClick={() => setStepIdx(p => Math.min(steps.length - 1, p + 1))} disabled={stepIdx === steps.length - 1}
              className="px-3 py-2 bg-gray-100 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-200">▶</button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Speed:</span>
              <input type="range" min={100} max={900} step={100} value={1000 - speed}
                onChange={e => setSpeed(1000 - Number(e.target.value))}
                className="w-20 accent-amber-500" />
            </div>
            <span className="text-xs text-gray-500">{stepIdx + 1}/{steps.length}</span>
          </>
        )}
      </div>

      {/* Bar chart */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <div className="flex items-end gap-2 h-40 justify-center">
          {currentStep.arr.map((val, i) => (
            <div key={i} className="flex flex-col items-center gap-1" style={{ width: '36px' }}>
              <div className="w-full" style={{ height: '120px', display: 'flex', alignItems: 'flex-end' }}>
                <div className="w-full" style={getBarStyle(i, val)}>
                  <span className="sr-only">{val}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-700">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step message */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 min-h-[60px]">
        <p className="text-sm text-gray-800">{currentStep.message}</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        {[
          { color: '#a5b4fc', border: '#6366f1', label: 'Unsorted' },
          { color: '#fde68a', border: '#f59e0b', label: 'Comparing' },
          { color: '#fca5a5', border: '#ef4444', label: 'Swapping' },
          { color: '#c4b5fd', border: '#8b5cf6', label: 'Pivot' },
          { color: '#6ee7b7', border: '#10b981', label: 'Sorted' },
        ].map(({ color, border, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border-2" style={{ backgroundColor: color, borderColor: border }} />
            <span className="text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
