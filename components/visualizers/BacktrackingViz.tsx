'use client';
import { useState } from 'react';

type Mode = 'subsets' | 'permutations' | 'combinations';

interface Step { current: number[]; choices: number[]; action: string; allResults: number[][] }

function genSubsetSteps(nums: number[]): Step[] {
  const steps: Step[] = [];
  const results: number[][] = [];
  function bt(start: number, current: number[]) {
    results.push([...current]);
    steps.push({ current: [...current], choices: nums.slice(start), action: current.length === 0 ? 'Start — empty subset ✓' : `Add ${current[current.length - 1]} → subset [${current.join(',')}] ✓`, allResults: results.map(r => [...r]) });
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      bt(i + 1, current);
      const popped = current.pop()!;
      steps.push({ current: [...current], choices: nums.slice(i + 1), action: `↩ Backtrack — remove ${popped}`, allResults: results.map(r => [...r]) });
    }
  }
  bt(0, []);
  return steps;
}

function genPermSteps(nums: number[]): Step[] {
  const steps: Step[] = [];
  const results: number[][] = [];
  const used = new Array(nums.length).fill(false);
  function bt(current: number[]) {
    if (current.length === nums.length) {
      results.push([...current]);
      steps.push({ current: [...current], choices: [], action: `✅ Complete permutation: [${current.join(',')}]`, allResults: results.map(r => [...r]) });
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; current.push(nums[i]);
      steps.push({ current: [...current], choices: nums.filter((_, j) => !used[j]), action: `Choose ${nums[i]} → [${current.join(',')}]`, allResults: results.map(r => [...r]) });
      bt(current);
      current.pop(); used[i] = false;
      steps.push({ current: [...current], choices: nums.filter((_, j) => !used[j]), action: `↩ Backtrack — unchoose ${nums[i]}`, allResults: results.map(r => [...r]) });
    }
  }
  bt([]);
  return steps;
}

function genCombSteps(nums: number[], target: number): Step[] {
  const steps: Step[] = [];
  const results: number[][] = [];
  function bt(start: number, current: number[], remaining: number) {
    if (remaining === 0) {
      results.push([...current]);
      steps.push({ current: [...current], choices: [], action: `✅ Found combination: [${current.join('+')}]=${target}`, allResults: results.map(r => [...r]) });
      return;
    }
    if (remaining < 0) {
      steps.push({ current: [...current], choices: [], action: `❌ Sum exceeded ${target} — backtrack`, allResults: results.map(r => [...r]) }); return;
    }
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      steps.push({ current: [...current], choices: nums.slice(i), action: `Add ${nums[i]} → [${current.join(',')}], remaining=${remaining - nums[i]}`, allResults: results.map(r => [...r]) });
      bt(i, current, remaining - nums[i]);
      current.pop();
      steps.push({ current: [...current], choices: nums.slice(i + 1), action: `↩ Backtrack — remove ${nums[i]}`, allResults: results.map(r => [...r]) });
    }
  }
  bt(0, [], target);
  return steps;
}

const NUMS = [1, 2, 3];
const COMB_TARGET = 4;
const COMB_NUMS = [1, 2, 3];

export default function BacktrackingViz() {
  const [mode, setMode] = useState<Mode>('subsets');
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [hasRun, setHasRun] = useState(false);

  const cur = steps[stepIdx];

  function run() {
    const s = mode === 'subsets' ? genSubsetSteps(NUMS) : mode === 'permutations' ? genPermSteps(NUMS) : genCombSteps(COMB_NUMS, COMB_TARGET);
    setSteps(s); setStepIdx(0); setHasRun(true);
  }

  const isBacktrack = cur?.action.includes('↩');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {([['subsets', '📦 Subsets'], ['permutations', '🔀 Permutations'], ['combinations', '🎯 Combination Sum']] as [Mode, string][]).map(([m, l]) => (
          <button key={m} onClick={() => { setMode(m); setSteps([]); setHasRun(false); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === m ? 'bg-violet-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-700">
          {mode === 'subsets' && `Generate all subsets of [${NUMS.join(', ')}]`}
          {mode === 'permutations' && `Generate all permutations of [${NUMS.join(', ')}]`}
          {mode === 'combinations' && `Find all combinations from [${COMB_NUMS.join(', ')}] that sum to ${COMB_TARGET} (reuse allowed)`}
        </p>
        <button onClick={run} className="mt-3 px-5 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 shadow-md shadow-violet-200">
          ▶ Run
        </button>
      </div>

      {hasRun && cur && (
        <div className="space-y-4">
          {/* Current path */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Current Path</p>
            <div className="flex gap-2 items-center min-h-[44px]">
              {cur.current.length === 0
                ? <span className="text-gray-300 text-sm italic">[ empty ]</span>
                : cur.current.map((n, i) => (
                  <span key={i} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold text-sm ${isBacktrack ? 'bg-red-100 border-red-400 text-red-700' : 'bg-violet-100 border-violet-400 text-violet-700'}`}>
                    {n}
                  </span>
                ))
              }
            </div>
          </div>

          {/* Step message */}
          <div className={`p-4 rounded-xl border-2 ${isBacktrack ? 'bg-red-50 border-red-200' : cur.action.includes('✅') ? 'bg-green-50 border-green-200' : 'bg-violet-50 border-violet-200'}`}>
            <p className="text-sm font-medium text-gray-800">{cur.action}</p>
          </div>

          {/* Results so far */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Results so far ({cur.allResults.length})</p>
            <div className="flex flex-wrap gap-2">
              {cur.allResults.map((r, i) => (
                <span key={i} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-mono">
                  [{r.join(',')}]
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button onClick={() => setStepIdx(p => Math.max(0, p - 1))} disabled={stepIdx === 0}
              className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200">← Prev</button>
            <span className="text-xs text-gray-500">{stepIdx + 1} / {steps.length}</span>
            <button onClick={() => setStepIdx(p => Math.min(steps.length - 1, p + 1))} disabled={stepIdx === steps.length - 1}
              className="px-3 py-1.5 text-xs bg-violet-100 text-violet-700 rounded-lg disabled:opacity-40 hover:bg-violet-200">Next →</button>
            <button onClick={() => setStepIdx(steps.length - 1)} className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 ml-2">Skip to end ⏭</button>
          </div>
        </div>
      )}

      <div className="flex gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded border-2 bg-violet-100 border-violet-400" /><span>Choosing</span></div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded border-2 bg-red-100 border-red-400" /><span>Backtracking</span></div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded border-2 bg-emerald-100 border-emerald-400" /><span>Result found</span></div>
      </div>
    </div>
  );
}
