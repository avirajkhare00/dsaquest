'use client';

import { useState } from 'react';

type Mode = 'fibonacci' | 'climbing' | 'coinchange';

interface Step {
  cells: (number | null)[];
  current: number;
  message: string;
}

function buildFibSteps(n: number): Step[] {
  const dp: (number | null)[] = new Array(n + 1).fill(null);
  dp[0] = 0; dp[1] = 1;
  const steps: Step[] = [
    { cells: [...dp], current: 1, message: 'Base cases: dp[0] = 0, dp[1] = 1' },
  ];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1]! + dp[i - 2]!;
    steps.push({ cells: [...dp], current: i, message: `dp[${i}] = dp[${i-1}](${dp[i-1]}) + dp[${i-2}](${dp[i-2]}) = ${dp[i]}` });
  }
  steps.push({ cells: [...dp], current: n, message: `✅ fib(${n}) = ${dp[n]}` });
  return steps;
}

function buildClimbingSteps(n: number): Step[] {
  const dp: (number | null)[] = new Array(n + 1).fill(null);
  dp[0] = 1; dp[1] = 1;
  const steps: Step[] = [
    { cells: [...dp], current: 1, message: 'Base cases: dp[0]=1 (start), dp[1]=1 (one way)' },
  ];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1]! + dp[i - 2]!;
    steps.push({ cells: [...dp], current: i, message: `dp[${i}] = dp[${i-1}](${dp[i-1]} ways) + dp[${i-2}](${dp[i-2]} ways) = ${dp[i]} ways` });
  }
  steps.push({ cells: [...dp], current: n, message: `✅ ${n} stairs → ${dp[n]} distinct ways to climb!` });
  return steps;
}

function buildCoinSteps(coins: number[], amount: number): Step[] {
  const dp: (number | null)[] = new Array(amount + 1).fill(null);
  dp[0] = 0;
  const steps: Step[] = [{ cells: [...dp], current: 0, message: `Base: dp[0] = 0 (0 coins to make amount 0)` }];
  for (let i = 1; i <= amount; i++) {
    let best = Infinity;
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] !== null && dp[i - coin]! + 1 < best) {
        best = dp[i - coin]! + 1;
      }
    }
    dp[i] = best === Infinity ? null : best;
    const usedCoins = coins.filter(c => c <= i && dp[i - c] !== null);
    steps.push({ cells: [...dp], current: i, message: dp[i] === null ? `dp[${i}]: impossible to make ${i}` : `dp[${i}] = min using coins [${usedCoins.join(',')}] → ${dp[i]} coin(s)` });
  }
  steps.push({ cells: [...dp], current: amount, message: dp[amount] === null ? `❌ Cannot make ${amount} with coins [${coins.join(', ')}]` : `✅ Min coins for ${amount} = ${dp[amount]}` });
  return steps;
}

const FIB_N = 10;
const CLIMB_N = 8;
const COINS = [1, 5, 6];
const AMOUNT = 11;

export default function DPViz() {
  const [mode, setMode] = useState<Mode>('fibonacci');
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [hasRun, setHasRun] = useState(false);

  const currentStep = steps[stepIdx];

  function run() {
    const s = mode === 'fibonacci' ? buildFibSteps(FIB_N)
            : mode === 'climbing' ? buildClimbingSteps(CLIMB_N)
            : buildCoinSteps(COINS, AMOUNT);
    setSteps(s); setStepIdx(0); setHasRun(true);
  }

  const getLabel = (i: number) =>
    mode === 'fibonacci' ? `fib(${i})` :
    mode === 'climbing' ? `stair ${i}` :
    `amt ${i}`;

  const totalCells = mode === 'fibonacci' ? FIB_N + 1 : mode === 'climbing' ? CLIMB_N + 1 : AMOUNT + 1;

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="flex flex-wrap gap-2">
        {([
          ['fibonacci', '🌀 Fibonacci'],
          ['climbing', '🏗️ Climbing Stairs'],
          ['coinchange', '🪙 Coin Change'],
        ] as [Mode, string][]).map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m); setSteps([]); setHasRun(false); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === m ? 'bg-rose-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Problem statement */}
      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
        {mode === 'fibonacci' && <p className="text-sm text-rose-800"><strong>Problem:</strong> Compute fib({FIB_N}). dp[i] = dp[i-1] + dp[i-2]</p>}
        {mode === 'climbing' && <p className="text-sm text-rose-800"><strong>Problem:</strong> How many ways to climb {CLIMB_N} stairs (1 or 2 steps at a time)? dp[i] = dp[i-1] + dp[i-2]</p>}
        {mode === 'coinchange' && <p className="text-sm text-rose-800"><strong>Problem:</strong> Min coins to make {AMOUNT} using [{COINS.join(', ')}]. dp[i] = min(dp[i-coin]+1) for each coin ≤ i</p>}
      </div>

      <button onClick={run}
        className="px-5 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600 shadow-md shadow-rose-200">
        ▶ Fill DP Table
      </button>

      {/* DP Table */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-2 min-w-max">
          {Array.from({ length: totalCells }, (_, i) => {
            const val = currentStep?.cells[i];
            const isCurrent = hasRun && currentStep && i === currentStep.current;
            const isFilled = val !== null && val !== undefined;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                {/* Index label */}
                <span className="text-xs text-gray-400 font-mono">{getLabel(i)}</span>
                {/* Cell */}
                <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isCurrent ? 'bg-amber-200 border-amber-400 text-amber-800 scale-110 shadow-md' :
                  isFilled ? 'bg-rose-100 border-rose-300 text-rose-800' :
                  'bg-gray-50 border-gray-200 text-gray-300'
                }`}>
                  {isFilled ? val : '?'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recurrence arrow */}
      {hasRun && currentStep && currentStep.current >= 2 && (
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl p-3">
          <span className="text-rose-500 font-bold">dp[{currentStep.current}]</span>
          <span>=</span>
          {mode === 'coinchange'
            ? <span>min across coins of (<span className="text-rose-400">dp[{currentStep.current} - coin]</span> + 1)</span>
            : <>
                <span className="text-rose-400">dp[{currentStep.current - 1}]</span>
                <span>+</span>
                <span className="text-rose-400">dp[{currentStep.current - 2}]</span>
              </>
          }
        </div>
      )}

      {/* Message */}
      {hasRun && currentStep && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-800">{currentStep.message}</p>
          <div className="mt-3 flex items-center gap-3">
            <button onClick={() => setStepIdx(p => Math.max(0, p - 1))} disabled={stepIdx === 0}
              className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200">← Prev</button>
            <span className="text-xs text-gray-500">{stepIdx + 1} / {steps.length}</span>
            <button onClick={() => setStepIdx(p => Math.min(steps.length - 1, p + 1))} disabled={stepIdx === steps.length - 1}
              className="px-3 py-1.5 text-xs bg-rose-100 text-rose-700 rounded-lg disabled:opacity-40 hover:bg-rose-200">Next →</button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded border-2 bg-gray-50 border-gray-200" /><span>Unfilled</span></div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded border-2 bg-rose-100 border-rose-300" /><span>Computed</span></div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded border-2 bg-amber-200 border-amber-400" /><span>Current</span></div>
      </div>
    </div>
  );
}
