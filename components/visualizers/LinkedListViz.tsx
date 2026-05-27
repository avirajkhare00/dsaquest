'use client';

import { useState } from 'react';

interface LLNode {
  val: number;
  id: number;
}

type Mode = 'traverse' | 'fast-slow' | 'reverse';

const INITIAL_LIST: LLNode[] = [
  { val: 1, id: 0 }, { val: 3, id: 1 }, { val: 5, id: 2 },
  { val: 7, id: 3 }, { val: 9, id: 4 }, { val: 2, id: 5 },
];

export default function LinkedListViz() {
  const [nodes] = useState<LLNode[]>(INITIAL_LIST);
  const [mode, setMode] = useState<Mode>('traverse');
  const [steps, setSteps] = useState<{ curr?: number | null; slow?: number | null; fast?: number | null; reversed?: number[]; message: string }[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [hasRun, setHasRun] = useState(false);

  const currentStep = steps[stepIdx];

  type StepType = { curr?: number | null; slow?: number | null; fast?: number | null; reversed?: number[]; message: string };

  function runTraverse() {
    const newSteps: StepType[] = nodes.map((node, i) => ({
      curr: i,
      message: `${i === 0 ? '🚀 Starting at' : '➡️ Moving to'} node at index ${i} — value: ${node.val}${i === nodes.length - 1 ? ' (tail → null ✅)' : ''}`,
    }));
    newSteps.push({ message: '✅ Traversal complete! Visited all nodes in O(n).' });
    setSteps(newSteps); setStepIdx(0); setHasRun(true);
  }

  function runFastSlow() {
    const newSteps: StepType[] = [];
    let slow = 0, fast = 0;
    newSteps.push({ slow, fast, message: `🐢 slow=idx${slow}(${nodes[slow].val})  🐇 fast=idx${fast}(${nodes[fast].val})  — Initialize both at head` });
    while (fast < nodes.length - 1 && fast + 1 < nodes.length - 1) {
      slow = slow + 1;
      fast = Math.min(fast + 2, nodes.length - 1);
      const atEnd = fast === nodes.length - 1;
      newSteps.push({
        slow, fast,
        message: `🐢 slow→idx${slow}(${nodes[slow].val})  🐇 fast→idx${fast}(${nodes[fast].val})${atEnd ? '  — Fast reached end! Middle found 🎉' : ''}`,
      });
    }
    newSteps.push({ slow, fast: undefined, message: `✅ Middle of list is idx${slow} — value ${nodes[slow].val}` });
    setSteps(newSteps); setStepIdx(0); setHasRun(true);
  }

  function runReverse() {
    const newSteps: StepType[] = [];
    let reversed: number[] = [];
    newSteps.push({ reversed: [], message: `🔄 Start reversing. prev=null, curr=idx0(${nodes[0].val})` });
    for (let i = 0; i < nodes.length; i++) {
      reversed = [i, ...reversed];
      newSteps.push({
        reversed: [...reversed],
        curr: i,
        message: `Reverse pointer: idx${i}(${nodes[i].val}).next → ${i > 0 ? `idx${i-1}(${nodes[i-1].val})` : 'null'}. Advance curr to idx${i+1 < nodes.length ? `${i+1}(${nodes[i+1].val})` : 'null'}.`,
      });
    }
    newSteps.push({ reversed: [...reversed], message: `✅ Reversed! New head: idx${nodes.length-1}(${nodes[nodes.length-1].val})` });
    setSteps(newSteps); setStepIdx(0); setHasRun(true);
  }

  function getNodeStyle(i: number) {
    if (!currentStep) return 'bg-indigo-100 border-indigo-300 text-indigo-700';
    const { curr, slow, fast } = currentStep;
    if (i === curr && mode === 'traverse') return 'bg-amber-200 border-amber-400 text-amber-800 scale-110 shadow-lg';
    if (mode === 'fast-slow') {
      if (i === slow && i === fast) return 'bg-purple-200 border-purple-400 text-purple-800 scale-110 shadow-lg';
      if (i === slow) return 'bg-pink-200 border-pink-400 text-pink-800 scale-105 shadow-md';
      if (i === fast) return 'bg-sky-200 border-sky-400 text-sky-800 scale-105 shadow-md';
    }
    if (mode === 'reverse' && i === curr) return 'bg-amber-200 border-amber-400 text-amber-800 scale-110';
    return 'bg-indigo-100 border-indigo-300 text-indigo-700';
  }

  const displayNodes = mode === 'reverse' && currentStep?.reversed && currentStep.reversed.length > 0
    ? currentStep.reversed.map(i => nodes[i])
    : nodes;

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="flex flex-wrap gap-2">
        {([['traverse', '🚶 Traverse'], ['fast-slow', '🐢🐇 Fast/Slow'], ['reverse', '🔄 Reverse']] as [Mode, string][]).map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m); setSteps([]); setHasRun(false); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === m ? 'bg-pink-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Run button */}
      <button
        onClick={() => { mode === 'traverse' ? runTraverse() : mode === 'fast-slow' ? runFastSlow() : runReverse(); }}
        className="px-5 py-2.5 bg-pink-500 text-white rounded-xl text-sm font-semibold hover:bg-pink-600 transition-colors shadow-md shadow-pink-200"
      >
        ▶ Run {mode === 'traverse' ? 'Traversal' : mode === 'fast-slow' ? 'Find Middle' : 'Reversal'}
      </button>

      {/* Linked list visualization */}
      <div className="overflow-x-auto pb-4">
        <div className="flex items-center gap-1 min-w-max">
          {/* HEAD label */}
          <div className="flex flex-col items-center mr-2">
            <span className="text-xs font-bold text-gray-500 mb-1">HEAD</span>
            <span className="text-gray-400">→</span>
          </div>

          {displayNodes.map((node, i) => (
            <div key={node.id} className="flex items-center gap-1">
              {/* Node */}
              <div className={`viz-node flex rounded-xl border-2 overflow-hidden transition-all duration-300 ${getNodeStyle(mode === 'reverse' && currentStep?.reversed ? currentStep.reversed.indexOf(nodes.indexOf(node)) : i)}`}>
                {/* Data section */}
                <div className="w-12 h-12 flex flex-col items-center justify-center border-r-2 border-current border-opacity-30">
                  <span className="font-bold text-base">{node.val}</span>
                  <span className="text-xs opacity-60">data</span>
                </div>
                {/* Next pointer section */}
                <div className="w-8 h-12 flex items-center justify-center opacity-60">
                  <span className="text-xs font-mono">{i < displayNodes.length - 1 ? '→' : '∅'}</span>
                </div>
              </div>

              {/* Arrow between nodes */}
              {i < displayNodes.length - 1 && (
                <span className="text-gray-400 text-lg">→</span>
              )}
            </div>
          ))}

          {/* NULL terminator */}
          <div className="ml-2 px-3 py-1 bg-gray-100 rounded-lg border border-dashed border-gray-300 text-xs text-gray-400 font-mono">
            null
          </div>
        </div>

        {/* Pointer labels below */}
        {hasRun && mode === 'fast-slow' && currentStep && (
          <div className="flex items-center gap-1 min-w-max mt-2">
            <div className="w-14 mr-2" />
            {nodes.map((_, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-20 flex justify-center gap-1">
                  {i === currentStep.slow && <span className="text-xs font-bold text-pink-500">🐢slow</span>}
                  {i === currentStep.fast && <span className="text-xs font-bold text-sky-500">🐇fast</span>}
                </div>
                {i < nodes.length - 1 && <div className="w-4" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Step message */}
      {currentStep && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-800">{currentStep.message}</p>
          {steps.length > 1 && (
            <div className="mt-3 flex items-center gap-3">
              <button onClick={() => setStepIdx(p => Math.max(0, p - 1))} disabled={stepIdx === 0}
                className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200">← Prev</button>
              <span className="text-xs text-gray-500">Step {stepIdx + 1} / {steps.length}</span>
              <button onClick={() => setStepIdx(p => Math.min(steps.length - 1, p + 1))} disabled={stepIdx === steps.length - 1}
                className="px-3 py-1.5 text-xs bg-pink-100 text-pink-700 rounded-lg disabled:opacity-40 hover:bg-pink-200">Next →</button>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-amber-200 border-2 border-amber-400" /><span>Current node</span></div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-pink-200 border-2 border-pink-400" /><span>Slow pointer</span></div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-sky-200 border-2 border-sky-400" /><span>Fast pointer</span></div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-indigo-100 border-2 border-indigo-300" /><span>Default</span></div>
      </div>
    </div>
  );
}
