'use client';
import { useState } from 'react';

type Mode = 'intervals' | 'jumpgame' | 'stock';

const INTERVALS: [number, number][] = [[1,4],[2,3],[3,6],[5,7],[6,8],[8,10]];
const JUMP_NUMS = [2, 3, 1, 1, 4, 0, 2];
const STOCK_PRICES = [7, 1, 5, 3, 6, 4, 2, 8];

interface Step { message: string; data: unknown }

function genIntervalSteps() {
  const sorted = [...INTERVALS].sort((a, b) => a[1] - b[1]);
  const steps: { selected: number[]; current: number; message: string }[] = [];
  const selected: number[] = [];
  let lastEnd = -Infinity;
  steps.push({ selected: [], current: -1, message: `Sort by end time: [${sorted.map(i => `[${i[0]},${i[1]}]`).join(', ')}]` });
  for (let i = 0; i < sorted.length; i++) {
    const [s, e] = sorted[i];
    if (s >= lastEnd) {
      selected.push(i);
      lastEnd = e;
      steps.push({ selected: [...selected], current: i, message: `✅ Take [${s},${e}] — starts at ${s} ≥ last end ${lastEnd === e ? 'N/A' : lastEnd}. Count: ${selected.length}` });
    } else {
      steps.push({ selected: [...selected], current: i, message: `❌ Skip [${s},${e}] — overlaps (starts ${s} < last end ${lastEnd})` });
    }
  }
  steps.push({ selected, current: -1, message: `✅ Done! Maximum non-overlapping intervals: ${selected.length}` });
  return { steps, sorted };
}

function genJumpSteps() {
  const steps: { maxReach: number; current: number; stuck: boolean; message: string }[] = [];
  let maxReach = 0;
  let stuck = false;
  for (let i = 0; i < JUMP_NUMS.length; i++) {
    if (i > maxReach) { stuck = true; steps.push({ maxReach, current: i, stuck: true, message: `❌ Stuck at index ${i} — maxReach=${maxReach} < ${i}. Cannot reach end.` }); break; }
    const prev = maxReach;
    maxReach = Math.max(maxReach, i + JUMP_NUMS[i]);
    steps.push({ maxReach, current: i, stuck: false, message: `idx ${i}: nums[${i}]=${JUMP_NUMS[i]}, maxReach = max(${prev}, ${i}+${JUMP_NUMS[i]}) = ${maxReach}` });
  }
  if (!stuck) steps.push({ maxReach, current: JUMP_NUMS.length - 1, stuck: false, message: `✅ Can reach end! maxReach=${maxReach} ≥ ${JUMP_NUMS.length - 1}` });
  return steps;
}

function genStockSteps() {
  const steps: { minPrice: number; maxProfit: number; current: number; message: string }[] = [];
  let minPrice = Infinity, maxProfit = 0;
  for (let i = 0; i < STOCK_PRICES.length; i++) {
    const price = STOCK_PRICES[i];
    const prevMin = minPrice, prevProfit = maxProfit;
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
    const action = minPrice < prevMin ? `New low! Buy at ${price}` : maxProfit > prevProfit ? `Sell at ${price} (profit ${price - minPrice})` : `Hold. Profit unchanged`;
    steps.push({ minPrice, maxProfit, current: i, message: `Day ${i+1}: price=${price}. ${action}. Best profit so far: $${maxProfit}` });
  }
  steps.push({ minPrice, maxProfit: maxProfit, current: -1, message: `✅ Max profit: $${maxProfit}` });
  return steps;
}

export default function GreedyViz() {
  const [mode, setMode] = useState<Mode>('intervals');
  const [stepIdx, setStepIdx] = useState(0);
  const [hasRun, setHasRun] = useState(false);

  const iSteps = genIntervalSteps();
  const jSteps = genJumpSteps();
  const sSteps = genStockSteps();

  const currentSteps = mode === 'intervals' ? iSteps.steps : mode === 'jumpgame' ? jSteps : sSteps;
  const cur = hasRun ? currentSteps[stepIdx] : null;

  function run() { setStepIdx(0); setHasRun(true); }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {([['intervals', '📅 Interval Scheduling'], ['jumpgame', '🦘 Jump Game'], ['stock', '📈 Best Stock']] as [Mode, string][]).map(([m, l]) => (
          <button key={m} onClick={() => { setMode(m); setHasRun(false); setStepIdx(0); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === m ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        {mode === 'intervals' && <p className="text-sm text-gray-700">Intervals: [{INTERVALS.map(i => `[${i[0]},${i[1]}]`).join(', ')}] — find max non-overlapping</p>}
        {mode === 'jumpgame' && <p className="text-sm text-gray-700">nums = [{JUMP_NUMS.join(', ')}] — can you reach the end?</p>}
        {mode === 'stock' && <p className="text-sm text-gray-700">Prices = [{STOCK_PRICES.join(', ')}] — max profit from one buy/sell</p>}
        <button onClick={run} className="mt-3 px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 shadow-md shadow-green-200">
          ▶ Run Greedy
        </button>
      </div>

      {/* Interval bars */}
      {mode === 'intervals' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Timeline</p>
          {iSteps.sorted.map((interval, i) => {
            const isCurrent = hasRun && cur && 'current' in cur && cur.current === i;
            const isSelected = hasRun && cur && 'selected' in cur && (cur as { selected: number[] }).selected.includes(i);
            return (
              <div key={i} className="flex items-center gap-2 mb-2">
                <div className="w-16 text-xs text-gray-500 text-right">[{interval[0]},{interval[1]}]</div>
                <div className="flex-1 relative h-6">
                  <div
                    className={`absolute h-full rounded-full transition-all ${isCurrent ? 'opacity-100' : isSelected ? 'opacity-100' : 'opacity-50'} ${isSelected ? 'bg-green-400' : isCurrent ? 'bg-amber-300' : 'bg-gray-200'}`}
                    style={{ left: `${(interval[0] / 11) * 100}%`, width: `${((interval[1] - interval[0]) / 11) * 100}%` }}
                  />
                </div>
                {isSelected && <span className="text-xs text-green-600 font-bold">✓</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* Jump game bars */}
      {mode === 'jumpgame' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex gap-2 flex-wrap">
            {JUMP_NUMS.map((val, i) => {
              const isCurrent = hasRun && cur && 'current' in cur && (cur as { current: number }).current === i;
              const maxR = hasRun && cur && 'maxReach' in cur ? (cur as { maxReach: number }).maxReach : 0;
              const inRange = hasRun && i <= maxR;
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all ${isCurrent ? 'bg-amber-200 border-amber-400 scale-110' : inRange ? 'bg-green-100 border-green-400' : 'bg-gray-100 border-gray-300'}`}>
                    {val}
                  </div>
                  <span className="text-xs text-gray-400">{i}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock chart */}
      {mode === 'stock' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-end gap-2 h-28">
            {STOCK_PRICES.map((price, i) => {
              const isCurrent = hasRun && cur && 'current' in cur && (cur as { current: number }).current === i;
              const minP = hasRun && cur && 'minPrice' in cur ? (cur as { minPrice: number }).minPrice : Infinity;
              const isMin = price === minP && hasRun;
              return (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-xs font-bold text-gray-600">${price}</span>
                  <div className={`w-full rounded-t-lg transition-all ${isCurrent ? 'bg-amber-400' : isMin ? 'bg-blue-400' : 'bg-indigo-200'}`}
                    style={{ height: `${(price / 10) * 70}px` }} />
                  <span className="text-xs text-gray-400">D{i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hasRun && cur && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-800">{'message' in cur ? cur.message : ''}</p>
          <div className="mt-3 flex items-center gap-3">
            <button onClick={() => setStepIdx(p => Math.max(0, p - 1))} disabled={stepIdx === 0}
              className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg disabled:opacity-40">← Prev</button>
            <span className="text-xs text-gray-500">{stepIdx + 1} / {currentSteps.length}</span>
            <button onClick={() => setStepIdx(p => Math.min(currentSteps.length - 1, p + 1))} disabled={stepIdx === currentSteps.length - 1}
              className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg disabled:opacity-40">Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
