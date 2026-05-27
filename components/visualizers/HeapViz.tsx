'use client';

import { useState } from 'react';

const INITIAL_HEAP: number[] = [];

interface Step {
  heap: number[];
  highlight: number[];
  swapping: [number, number] | null;
  message: string;
}

function parentIdx(i: number) { return Math.floor((i - 1) / 2); }
function leftIdx(i: number)   { return 2 * i + 1; }
function rightIdx(i: number)  { return 2 * i + 2; }

function heapifyUp(arr: number[], i: number, steps: Step[]) {
  while (i > 0 && arr[parentIdx(i)] > arr[i]) {
    const p = parentIdx(i);
    steps.push({ heap: [...arr], highlight: [i, p], swapping: [i, p], message: `arr[${i}]=${arr[i]} < arr[${p}]=${arr[p]} → swap (bubble up)` });
    [arr[i], arr[p]] = [arr[p], arr[i]];
    i = p;
    steps.push({ heap: [...arr], highlight: [i], swapping: null, message: `Swapped! Now at index ${i}` });
  }
}

function heapifyDown(arr: number[], i: number, steps: Step[]) {
  const n = arr.length;
  while (true) {
    let smallest = i;
    const l = leftIdx(i), r = rightIdx(i);
    if (l < n && arr[l] < arr[smallest]) smallest = l;
    if (r < n && arr[r] < arr[smallest]) smallest = r;
    if (smallest === i) break;
    steps.push({ heap: [...arr], highlight: [i, smallest], swapping: [i, smallest], message: `arr[${i}]=${arr[i]} > arr[${smallest}]=${arr[smallest]} → swap (sink down)` });
    [arr[i], arr[smallest]] = [arr[smallest], arr[i]];
    i = smallest;
    steps.push({ heap: [...arr], highlight: [i], swapping: null, message: `Swapped! Now at index ${i}` });
  }
}

type Mode = 'insert' | 'extract' | 'topk';

export default function HeapViz() {
  const [heap, setHeap] = useState<number[]>([1, 3, 5, 7, 9, 8, 6]);
  const [insertVal, setInsertVal] = useState(2);
  const [mode, setMode] = useState<Mode>('insert');
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [hasRun, setHasRun] = useState(false);
  const [kValue, setKValue] = useState(3);
  const [topKResult, setTopKResult] = useState<number[]>([]);
  const TOPK_NUMS = [7, 2, 9, 4, 1, 8, 3, 6, 5];

  const currentStep = steps[stepIdx];
  const displayHeap = hasRun && currentStep ? currentStep.heap : heap;

  function runInsert() {
    const arr = [...heap];
    const newSteps: Step[] = [];
    arr.push(insertVal);
    newSteps.push({ heap: [...arr], highlight: [arr.length - 1], swapping: null, message: `Insert ${insertVal} at end (index ${arr.length - 1})` });
    heapifyUp(arr, arr.length - 1, newSteps);
    newSteps.push({ heap: [...arr], highlight: [0], swapping: null, message: `✅ Inserted! Min is still arr[0]=${arr[0]}` });
    setSteps(newSteps); setStepIdx(0); setHasRun(true); setHeap(arr);
  }

  function runExtract() {
    if (heap.length === 0) return;
    const arr = [...heap];
    const newSteps: Step[] = [];
    newSteps.push({ heap: [...arr], highlight: [0], swapping: null, message: `Extract min = arr[0] = ${arr[0]}` });
    const last = arr.pop()!;
    if (arr.length > 0) {
      arr[0] = last;
      newSteps.push({ heap: [...arr], highlight: [0], swapping: null, message: `Move last element (${last}) to root` });
      heapifyDown(arr, 0, newSteps);
    }
    newSteps.push({ heap: [...arr], highlight: [0], swapping: null, message: arr.length > 0 ? `✅ Extracted! New min = ${arr[0]}` : `✅ Heap is now empty` });
    setSteps(newSteps); setStepIdx(0); setHasRun(true); setHeap(arr);
  }

  function runTopK() {
    const nums = TOPK_NUMS;
    const k = kValue;
    const minHeap: number[] = [];
    const newSteps: Step[] = [];

    const insert = (val: number) => {
      minHeap.push(val);
      let i = minHeap.length - 1;
      while (i > 0 && minHeap[parentIdx(i)] > minHeap[i]) {
        [minHeap[i], minHeap[parentIdx(i)]] = [minHeap[parentIdx(i)], minHeap[i]];
        i = parentIdx(i);
      }
    };
    const popMin = (): number => {
      const min = minHeap[0];
      const last = minHeap.pop()!;
      if (minHeap.length > 0) { minHeap[0] = last; heapifyDown(minHeap, 0, []); }
      return min;
    };

    for (let i = 0; i < nums.length; i++) {
      insert(nums[i]);
      if (minHeap.length > k) {
        const evicted = popMin();
        newSteps.push({ heap: [...minHeap], highlight: [0], swapping: null, message: `Inserted ${nums[i]}, heap size > ${k} → evict min (${evicted}). Heap: [${minHeap.join(', ')}]` });
      } else {
        newSteps.push({ heap: [...minHeap], highlight: [minHeap.length - 1], swapping: null, message: `Inserted ${nums[i]}. Heap size = ${minHeap.length}/${k}. Heap: [${minHeap.join(', ')}]` });
      }
    }

    const result = [...minHeap].sort((a, b) => b - a);
    newSteps.push({ heap: [...minHeap], highlight: minHeap.map((_, i) => i), swapping: null, message: `✅ Top-${k} largest: [${result.join(', ')}]. Heap min = ${minHeap[0]} = ${k}th largest!` });
    setTopKResult(result);
    setSteps(newSteps); setStepIdx(0); setHasRun(true);
  }

  // Get SVG positions for heap tree (like a complete binary tree)
  function getNodePos(i: number): { x: number; y: number } {
    const n = displayHeap.length;
    const depth = Math.floor(Math.log2(i + 1));
    const maxDepth = Math.floor(Math.log2(Math.max(n, 1)));
    const posInLevel = i - (Math.pow(2, depth) - 1);
    const nodesAtLevel = Math.pow(2, depth);
    const W = 300;
    const x = ((posInLevel + 0.5) / nodesAtLevel) * W;
    const y = depth * 60 + 25;
    return { x, y };
  }

  const edges: { from: number; to: number }[] = [];
  for (let i = 1; i < displayHeap.length; i++) edges.push({ from: parentIdx(i), to: i });

  function getNodeColor(i: number) {
    if (!hasRun || !currentStep) return { fill: '#fef3c7', stroke: '#f59e0b', text: '#92400e' };
    if (currentStep.swapping && (currentStep.swapping[0] === i || currentStep.swapping[1] === i))
      return { fill: '#fca5a5', stroke: '#ef4444', text: '#7f1d1d' };
    if (currentStep.highlight.includes(i))
      return { fill: '#fde68a', stroke: '#f59e0b', text: '#92400e' };
    return { fill: '#fef3c7', stroke: '#d97706', text: '#92400e' };
  }

  const svgHeight = Math.max(80, Math.floor(Math.log2(Math.max(displayHeap.length, 1))) * 60 + 60);

  return (
    <div className="space-y-6">
      {/* Mode */}
      <div className="flex flex-wrap gap-2">
        {([
          ['insert', '➕ Insert'],
          ['extract', '📤 Extract Min'],
          ['topk', '🏆 Top-K'],
        ] as [Mode, string][]).map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m); setSteps([]); setHasRun(false); setTopKResult([]); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === m ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap gap-3 items-end">
        {mode === 'insert' && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Value to insert</label>
            <input type="number" value={insertVal} onChange={e => setInsertVal(Number(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
        )}
        {mode === 'topk' && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">K</label>
            <input type="number" min={1} max={9} value={kValue} onChange={e => setKValue(Number(e.target.value))}
              className="w-16 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
        )}
        {mode === 'topk' && (
          <p className="text-xs text-gray-500">Array: [{TOPK_NUMS.join(', ')}]</p>
        )}
        <button onClick={() => mode === 'insert' ? runInsert() : mode === 'extract' ? runExtract() : runTopK()}
          className="px-5 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 shadow-md shadow-amber-200">
          ▶ Run
        </button>
      </div>

      {/* Heap tree (SVG) */}
      {mode !== 'topk' && (
        <div className="bg-white rounded-2xl border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 pt-4">Min-Heap Tree</p>
          <svg width="300" height={svgHeight} viewBox={`0 0 300 ${svgHeight}`} className="mx-auto">
            {edges.map(e => {
              const fp = getNodePos(e.from), tp = getNodePos(e.to);
              return <line key={`${e.from}-${e.to}`} x1={fp.x} y1={fp.y} x2={tp.x} y2={tp.y} stroke="#e5e7eb" strokeWidth="2" />;
            })}
            {displayHeap.map((val, i) => {
              const { x, y } = getNodePos(i);
              const c = getNodeColor(i);
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={18} fill={c.fill} stroke={c.stroke} strokeWidth="2.5"
                    style={{ transition: 'all 0.3s' }} />
                  <text x={x} y={y + 5} textAnchor="middle" fontSize="12" fontWeight="bold" fill={c.text}>{val}</text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Array representation */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          {mode === 'topk' ? 'Heap (Size-K Min-Heap)' : 'Array Representation'}
        </p>
        <div className="flex gap-2 flex-wrap">
          {displayHeap.map((val, i) => {
            const c = getNodeColor(i);
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all"
                  style={{ backgroundColor: c.fill, borderColor: c.stroke, color: c.text }}>
                  {val}
                </div>
                <span className="text-xs text-gray-400">{i}</span>
                {i === 0 && <span className="text-xs text-amber-600 font-bold">min</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step message */}
      {hasRun && currentStep && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-800">{currentStep.message}</p>
          {steps.length > 1 && (
            <div className="mt-3 flex items-center gap-3">
              <button onClick={() => setStepIdx(p => Math.max(0, p - 1))} disabled={stepIdx === 0}
                className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg disabled:opacity-40">← Prev</button>
              <span className="text-xs text-gray-500">{stepIdx + 1} / {steps.length}</span>
              <button onClick={() => setStepIdx(p => Math.min(steps.length - 1, p + 1))} disabled={stepIdx === steps.length - 1}
                className="px-3 py-1.5 text-xs bg-amber-100 text-amber-700 rounded-lg disabled:opacity-40">Next →</button>
            </div>
          )}
        </div>
      )}

      {/* Top-K result */}
      {topKResult.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-bold text-amber-800">🏆 Top-{kValue} largest: [{topKResult.join(', ')}]</p>
          <p className="text-xs text-amber-700 mt-1">Heap min = {Math.min(...topKResult)} = {kValue}th largest (the "worst" of the best {kValue})</p>
        </div>
      )}

      {/* Info */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
        <p className="text-xs font-bold text-amber-700 mb-1">⛰️ Min-Heap Property</p>
        <p className="text-xs text-amber-800">Every parent ≤ both children. Root is always the minimum. Parent of i: ⌊(i-1)/2⌋. Children of i: 2i+1 and 2i+2.</p>
      </div>
    </div>
  );
}
