'use client';

import { useState } from 'react';

interface GraphNode { id: number; x: number; y: number; label: string }
interface GraphEdge { from: number; to: number }

// Undirected graph
const NODES: GraphNode[] = [
  { id: 0, x: 160, y: 40,  label: 'A' },
  { id: 1, x: 60,  y: 110, label: 'B' },
  { id: 2, x: 260, y: 110, label: 'C' },
  { id: 3, x: 60,  y: 210, label: 'D' },
  { id: 4, x: 160, y: 190, label: 'E' },
  { id: 5, x: 270, y: 210, label: 'F' },
  { id: 6, x: 160, y: 290, label: 'G' },
];

const EDGES: GraphEdge[] = [
  { from: 0, to: 1 }, { from: 0, to: 2 },
  { from: 1, to: 3 }, { from: 1, to: 4 },
  { from: 2, to: 4 }, { from: 2, to: 5 },
  { from: 3, to: 6 }, { from: 4, to: 6 },
  { from: 5, to: 6 },
];

const ADJ: number[][] = Array.from({ length: 7 }, () => []);
EDGES.forEach(e => { ADJ[e.from].push(e.to); ADJ[e.to].push(e.from); });

type Mode = 'bfs' | 'dfs';

interface Step {
  visited: number[];
  current: number;
  queue: number[];
  message: string;
}

function buildBFSSteps(start: number): Step[] {
  const steps: Step[] = [];
  const visited = new Set<number>([start]);
  const queue = [start];
  const visitedArr: number[] = [start];

  steps.push({ visited: [...visitedArr], current: start, queue: [...queue], message: `Start BFS from node ${NODES[start].label}. Queue: [${NODES[start].label}]` });

  while (queue.length > 0) {
    const node = queue.shift()!;
    for (const neighbor of ADJ[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        visitedArr.push(neighbor);
        queue.push(neighbor);
        steps.push({ visited: [...visitedArr], current: neighbor, queue: [...queue], message: `Visit ${NODES[neighbor].label} (neighbor of ${NODES[node].label}). Queue: [${queue.map(n => NODES[n].label).join(', ')}]` });
      }
    }
  }
  steps.push({ visited: [...visitedArr], current: -1, queue: [], message: `✅ BFS complete! Visited: ${visitedArr.map(n => NODES[n].label).join(' → ')}` });
  return steps;
}

function buildDFSSteps(start: number): Step[] {
  const steps: Step[] = [];
  const visited = new Set<number>();
  const visitedArr: number[] = [];
  const stack: number[] = [];

  function dfs(node: number) {
    visited.add(node);
    visitedArr.push(node);
    stack.push(node);
    steps.push({ visited: [...visitedArr], current: node, queue: [...stack], message: `Visit ${NODES[node].label}. Stack: [${stack.map(n => NODES[n].label).join(', ')}]` });

    for (const neighbor of ADJ[node]) {
      if (!visited.has(neighbor)) dfs(neighbor);
    }

    stack.pop();
    if (stack.length > 0) {
      steps.push({ visited: [...visitedArr], current: stack[stack.length - 1], queue: [...stack], message: `Backtrack to ${NODES[stack[stack.length - 1]].label}. Stack: [${stack.map(n => NODES[n].label).join(', ')}]` });
    }
  }

  dfs(start);
  steps.push({ visited: [...visitedArr], current: -1, queue: [], message: `✅ DFS complete! Visited: ${visitedArr.map(n => NODES[n].label).join(' → ')}` });
  return steps;
}

export default function GraphViz() {
  const [mode, setMode] = useState<Mode>('bfs');
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [startNode, setStartNode] = useState(0);
  const [hasRun, setHasRun] = useState(false);

  const currentStep = steps[stepIdx];

  function run() {
    const newSteps = mode === 'bfs' ? buildBFSSteps(startNode) : buildDFSSteps(startNode);
    setSteps(newSteps);
    setStepIdx(0);
    setHasRun(true);
  }

  function getNodeColor(id: number) {
    if (!hasRun || !currentStep) return { fill: '#e0e7ff', stroke: '#6366f1', text: '#4338ca' };
    if (id === currentStep.current) return { fill: '#fde68a', stroke: '#f59e0b', text: '#92400e' };
    if (currentStep.visited.includes(id)) return { fill: '#d1fae5', stroke: '#10b981', text: '#065f46' };
    return { fill: '#e0e7ff', stroke: '#6366f1', text: '#4338ca' };
  }

  function isEdgeActive(from: number, to: number) {
    if (!hasRun || !currentStep) return false;
    const vis = currentStep.visited;
    const fromIdx = vis.indexOf(from);
    const toIdx = vis.indexOf(to);
    return fromIdx !== -1 && toIdx !== -1;
  }

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="flex gap-2">
        {([['bfs', '🌊 BFS (Shortest Path)'], ['dfs', '🕳️ DFS (Explore Deep)']] as [Mode, string][]).map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m); setSteps([]); setHasRun(false); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === m ? 'bg-cyan-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4 bg-gray-50 rounded-xl p-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500">Start node</label>
          <select value={startNode} onChange={e => setStartNode(Number(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
            {NODES.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
          </select>
        </div>
        <button onClick={run}
          className="px-5 py-2 bg-cyan-500 text-white rounded-lg text-sm font-semibold hover:bg-cyan-600 shadow-md shadow-cyan-200">
          ▶ Run {mode.toUpperCase()}
        </button>
      </div>

      {/* Graph SVG */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <svg width="330" height="330" viewBox="0 0 330 330" className="mx-auto">
          {/* Edges */}
          {EDGES.map(e => {
            const from = NODES[e.from], to = NODES[e.to];
            const active = isEdgeActive(e.from, e.to);
            return (
              <line key={`${e.from}-${e.to}`}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={active ? '#10b981' : '#e5e7eb'} strokeWidth={active ? 3 : 2}
                style={{ transition: 'stroke 0.3s' }} />
            );
          })}
          {/* Nodes */}
          {NODES.map(node => {
            const c = getNodeColor(node.id);
            return (
              <g key={node.id}>
                <circle cx={node.x} cy={node.y} r={20}
                  fill={c.fill} stroke={c.stroke} strokeWidth={2.5}
                  style={{ transition: 'all 0.3s', cursor: 'pointer' }}
                  onClick={() => setStartNode(node.id)} />
                <text x={node.x} y={node.y + 5} textAnchor="middle"
                  fontSize="14" fontWeight="bold" fill={c.text}>{node.label}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Traversal info */}
      {hasRun && currentStep && (
        <div className="space-y-3">
          {/* Queue/Stack display */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">
              {mode === 'bfs' ? '📦 Queue (FIFO)' : '📚 Stack (LIFO)'}
            </p>
            <div className="flex gap-2 flex-wrap min-h-[32px]">
              {currentStep.queue.length === 0
                ? <span className="text-xs text-gray-300 italic">empty</span>
                : currentStep.queue.map((n, i) => (
                  <span key={i} className={`text-sm font-bold px-3 py-1 rounded-full ${mode === 'bfs' ? 'bg-cyan-100 text-cyan-700' : 'bg-rose-100 text-rose-700'}`}>
                    {NODES[n].label}
                  </span>
                ))
              }
            </div>
          </div>

          {/* Visit order */}
          <div className="flex flex-wrap gap-1 items-center">
            <span className="text-xs font-semibold text-gray-400 mr-1">Visited:</span>
            {currentStep.visited.map((n, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="text-sm font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  {NODES[n].label}
                </span>
                {i < currentStep.visited.length - 1 && <span className="text-gray-300">→</span>}
              </span>
            ))}
          </div>

          {/* Message */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-800">{currentStep.message}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button onClick={() => setStepIdx(p => Math.max(0, p - 1))} disabled={stepIdx === 0}
              className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200">← Prev</button>
            <span className="text-xs text-gray-500">{stepIdx + 1} / {steps.length}</span>
            <button onClick={() => setStepIdx(p => Math.min(steps.length - 1, p + 1))} disabled={stepIdx === steps.length - 1}
              className="px-3 py-1.5 text-xs bg-cyan-100 text-cyan-700 rounded-lg disabled:opacity-40 hover:bg-cyan-200">Next →</button>
          </div>
        </div>
      )}

      {/* Info card */}
      <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4">
        <p className="text-xs font-bold text-cyan-700 mb-1">
          {mode === 'bfs' ? '🌊 BFS uses a Queue (FIFO)' : '🕳️ DFS uses a Stack (LIFO / recursion)'}
        </p>
        <p className="text-xs text-cyan-800">
          {mode === 'bfs'
            ? 'BFS explores level by level — guarantees shortest path in unweighted graphs. Use for: shortest path, min steps, nearest neighbor.'
            : 'DFS goes as deep as possible before backtracking. Use for: count components, cycle detection, topological sort, all paths.'}
        </p>
      </div>
    </div>
  );
}
