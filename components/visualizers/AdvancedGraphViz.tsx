'use client';
import { useState } from 'react';

type Mode = 'dijkstra' | 'unionfind' | 'toposort';

// Weighted graph for Dijkstra
interface WNode { id: number; x: number; y: number; label: string }
interface WEdge { from: number; to: number; weight: number }

const WNODES: WNode[] = [
  { id: 0, x: 160, y: 30,  label: 'A' },
  { id: 1, x: 50,  y: 120, label: 'B' },
  { id: 2, x: 270, y: 120, label: 'C' },
  { id: 3, x: 50,  y: 230, label: 'D' },
  { id: 4, x: 160, y: 200, label: 'E' },
  { id: 5, x: 270, y: 230, label: 'F' },
];
const WEDGES: WEdge[] = [
  { from: 0, to: 1, weight: 4 }, { from: 0, to: 2, weight: 2 },
  { from: 1, to: 3, weight: 5 }, { from: 1, to: 4, weight: 1 },
  { from: 2, to: 4, weight: 3 }, { from: 2, to: 5, weight: 8 },
  { from: 4, to: 3, weight: 2 }, { from: 4, to: 5, weight: 6 },
];

function buildDijkSteps(start: number) {
  const n = WNODES.length;
  const dist = new Array(n).fill(Infinity);
  const visited = new Set<number>();
  dist[start] = 0;
  const steps: { dist: number[]; current: number; relaxed: number[]; message: string }[] = [];
  steps.push({ dist: [...dist], current: start, relaxed: [], message: `Start Dijkstra from ${WNODES[start].label}. dist[${WNODES[start].label}]=0, all others=∞` });

  for (let iter = 0; iter < n; iter++) {
    // Find min dist unvisited
    let u = -1;
    for (let i = 0; i < n; i++) if (!visited.has(i) && (u === -1 || dist[i] < dist[u])) u = i;
    if (u === -1 || dist[u] === Infinity) break;
    visited.add(u);
    steps.push({ dist: [...dist], current: u, relaxed: [], message: `Pop ${WNODES[u].label} (dist=${dist[u]}) — finalized! ✓` });

    const relaxed: number[] = [];
    for (const e of WEDGES.filter(e => e.from === u || e.to === u)) {
      const v = e.from === u ? e.to : e.from;
      if (visited.has(v)) continue;
      const newDist = dist[u] + e.weight;
      if (newDist < dist[v]) {
        dist[v] = newDist;
        relaxed.push(v);
        steps.push({ dist: [...dist], current: u, relaxed: [v], message: `Relax: dist[${WNODES[v].label}] = dist[${WNODES[u].label}](${dist[u]}) + weight(${e.weight}) = ${newDist}` });
      }
    }
  }
  steps.push({ dist: [...dist], current: -1, relaxed: [], message: `✅ Done! Shortest distances from ${WNODES[start].label}: ${dist.map((d, i) => `${WNODES[i].label}=${d === Infinity ? '∞' : d}`).join(', ')}` });
  return steps;
}

// Union-Find viz
const UF_NODES = 7;
const UF_EDGES: [number, number][] = [[0,1],[2,3],[4,5],[1,2],[3,6]];

function buildUFSteps() {
  const parent = Array.from({ length: UF_NODES }, (_, i) => i);
  const rank = new Array(UF_NODES).fill(0);
  function find(x: number): number { return parent[x] === x ? x : (parent[x] = find(parent[x])); }
  const steps: { parent: number[]; current: [number,number]; components: number; message: string }[] = [];
  steps.push({ parent: [...parent], current: [-1,-1], components: UF_NODES, message: `Initial: ${UF_NODES} components, each node is its own root` });
  for (const [u, v] of UF_EDGES) {
    const pu = find(u), pv = find(v);
    if (pu !== pv) {
      if (rank[pu] < rank[pv]) parent[pu] = pv;
      else if (rank[pu] > rank[pv]) parent[pv] = pu;
      else { parent[pv] = pu; rank[pu]++; }
      const comps = new Set(Array.from({ length: UF_NODES }, (_, i) => find(i))).size;
      steps.push({ parent: [...parent], current: [u, v], components: comps, message: `Union(${u},${v}): merge components. Roots: ${pu}→${pv}. Components: ${comps}` });
    } else {
      steps.push({ parent: [...parent], current: [u, v], components: new Set(Array.from({ length: UF_NODES }, (_, i) => find(i))).size, message: `Union(${u},${v}): already same component (root=${pu}) — CYCLE detected!` });
    }
  }
  return steps;
}

// Topological sort
const TOPO_NODES = ['A','B','C','D','E','F'];
const TOPO_EDGES: [number,number][] = [[0,2],[0,3],[1,3],[1,4],[2,5],[3,5],[4,5]];

function buildTopoSteps() {
  const n = TOPO_NODES.length;
  const inDegree = new Array(n).fill(0);
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of TOPO_EDGES) { adj[u].push(v); inDegree[v]++; }
  const steps: { queue: number[]; order: number[]; inDegree: number[]; current: number; message: string }[] = [];
  const queue = Array.from({ length: n }, (_, i) => i).filter(i => inDegree[i] === 0);
  const order: number[] = [];
  steps.push({ queue: [...queue], order: [], inDegree: [...inDegree], current: -1, message: `Init: nodes with in-degree 0 = [${queue.map(i => TOPO_NODES[i]).join(', ')}]` });
  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    for (const next of adj[node]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
    steps.push({ queue: [...queue], order: [...order], inDegree: [...inDegree], current: node, message: `Process ${TOPO_NODES[node]}: decrement neighbors' in-degrees. Queue: [${queue.map(i => TOPO_NODES[i]).join(', ')}]` });
  }
  steps.push({ queue: [], order, inDegree, current: -1, message: `✅ Topological order: ${order.map(i => TOPO_NODES[i]).join(' → ')}` });
  return steps;
}

export default function AdvancedGraphViz() {
  const [mode, setMode] = useState<Mode>('dijkstra');
  const [startNode, setStartNode] = useState(0);
  const [dSteps] = useState(() => buildDijkSteps(0));
  const [ufSteps] = useState(() => buildUFSteps());
  const [topoSteps] = useState(() => buildTopoSteps());
  const [dStepsState, setDSteps] = useState<ReturnType<typeof buildDijkSteps>>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [hasRun, setHasRun] = useState(false);

  const steps = mode === 'dijkstra' ? dStepsState : mode === 'unionfind' ? ufSteps : topoSteps;
  const cur = hasRun && steps[stepIdx] ? steps[stepIdx] : null;

  function run() {
    if (mode === 'dijkstra') setDSteps(buildDijkSteps(startNode));
    setStepIdx(0); setHasRun(true);
  }

  function getNodeColor(i: number): { fill: string; stroke: string; text: string } {
    if (!cur) return { fill: '#e0f2fe', stroke: '#0ea5e9', text: '#0369a1' };
    if (mode === 'dijkstra') {
      const d = cur as ReturnType<typeof buildDijkSteps>[0];
      if (d.current === i) return { fill: '#fde68a', stroke: '#f59e0b', text: '#92400e' };
      if (d.relaxed.includes(i)) return { fill: '#d1fae5', stroke: '#10b981', text: '#065f46' };
      if (d.dist[i] < Infinity) return { fill: '#e0f2fe', stroke: '#0ea5e9', text: '#0369a1' };
    }
    return { fill: '#e0f2fe', stroke: '#0ea5e9', text: '#0369a1' };
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {([['dijkstra', '🗺️ Dijkstra'], ['unionfind', '🔗 Union-Find'], ['toposort', '📋 Topo Sort']] as [Mode, string][]).map(([m, l]) => (
          <button key={m} onClick={() => { setMode(m); setHasRun(false); setStepIdx(0); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === m ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {l}
          </button>
        ))}
      </div>

      {mode === 'dijkstra' && (
        <div className="flex gap-3 items-end bg-gray-50 rounded-xl p-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Start node</label>
            <select value={startNode} onChange={e => setStartNode(Number(e.target.value))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              {WNODES.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </div>
          <button onClick={run} className="px-5 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 shadow-md shadow-teal-200">▶ Run Dijkstra</button>
        </div>
      )}

      {(mode === 'unionfind' || mode === 'toposort') && (
        <button onClick={run} className="px-5 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 shadow-md shadow-teal-200">▶ Run {mode === 'unionfind' ? 'Union-Find' : 'Kahn\'s Topo Sort'}</button>
      )}

      {/* Dijkstra graph */}
      {mode === 'dijkstra' && (
        <div className="bg-white rounded-2xl border border-gray-100">
          <svg width="320" height="270" viewBox="0 0 320 270" className="mx-auto">
            {WEDGES.map(e => {
              const f = WNODES[e.from], t = WNODES[e.to];
              const mx = (f.x + t.x) / 2, my = (f.y + t.y) / 2;
              return (
                <g key={`${e.from}-${e.to}`}>
                  <line x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke="#e5e7eb" strokeWidth="2" />
                  <rect x={mx - 9} y={my - 9} width={18} height={14} rx={3} fill="white" />
                  <text x={mx} y={my + 2} textAnchor="middle" fontSize="10" fill="#6b7280" fontWeight="bold">{e.weight}</text>
                </g>
              );
            })}
            {WNODES.map(node => {
              const c = getNodeColor(node.id);
              const dist = cur && 'dist' in cur ? (cur as { dist: number[] }).dist[node.id] : Infinity;
              return (
                <g key={node.id}>
                  <circle cx={node.x} cy={node.y} r={20} fill={c.fill} stroke={c.stroke} strokeWidth="2.5" style={{ transition: 'all 0.3s' }} />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="13" fontWeight="bold" fill={c.text}>{node.label}</text>
                  {dist < Infinity && <text x={node.x} y={node.y + 35} textAnchor="middle" fontSize="10" fill="#0369a1" fontWeight="bold">{dist}</text>}
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Union-Find viz */}
      {mode === 'unionfind' && cur && 'parent' in cur && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Parent Array</p>
          <div className="flex gap-3 flex-wrap">
            {Array.from({ length: UF_NODES }, (_, i) => {
              const ufCur = cur as ReturnType<typeof buildUFSteps>[0];
              const isActive = ufCur.current[0] === i || ufCur.current[1] === i;
              return (
                <div key={i} className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${isActive ? 'bg-teal-100 border-teal-400' : 'bg-gray-50 border-gray-200'}`}>
                  <span className="text-xs text-gray-500">node {i}</span>
                  <span className="font-bold text-lg">{i}</span>
                  <span className="text-xs text-gray-400">parent: <strong>{ufCur.parent[i]}</strong></span>
                  {ufCur.parent[i] === i && <span className="text-xs text-teal-600 font-bold">root</span>}
                </div>
              );
            })}
          </div>
          <p className="text-sm font-semibold text-gray-700 mt-3">Components: {(cur as ReturnType<typeof buildUFSteps>[0]).components}</p>
        </div>
      )}

      {/* Topo Sort viz */}
      {mode === 'toposort' && cur && 'order' in cur && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">In-Degrees</p>
            <div className="flex gap-2 flex-wrap">
              {TOPO_NODES.map((label, i) => {
                const topoCur = cur as ReturnType<typeof buildTopoSteps>[0];
                const processed = topoCur.order.includes(i);
                return (
                  <div key={i} className={`flex flex-col items-center px-3 py-2 rounded-xl border-2 transition-all ${topoCur.current === i ? 'bg-amber-100 border-amber-400' : processed ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-gray-200'}`}>
                    <span className="font-bold">{label}</span>
                    <span className="text-xs text-gray-500">in: {topoCur.inDegree[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Order so far</p>
            <div className="flex gap-2 items-center">
              {(cur as ReturnType<typeof buildTopoSteps>[0]).order.map((i, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  <span className="bg-teal-100 text-teal-700 font-bold px-3 py-1 rounded-full text-sm">{TOPO_NODES[i]}</span>
                  {idx < (cur as ReturnType<typeof buildTopoSteps>[0]).order.length - 1 && <span className="text-gray-300">→</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {hasRun && cur && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-800">{'message' in cur ? cur.message : ''}</p>
          <div className="mt-3 flex items-center gap-3">
            <button onClick={() => setStepIdx(p => Math.max(0, p - 1))} disabled={stepIdx === 0}
              className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg disabled:opacity-40">← Prev</button>
            <span className="text-xs text-gray-500">{stepIdx + 1} / {steps.length}</span>
            <button onClick={() => setStepIdx(p => Math.min(steps.length - 1, p + 1))} disabled={stepIdx === steps.length - 1}
              className="px-3 py-1.5 text-xs bg-teal-100 text-teal-700 rounded-lg disabled:opacity-40">Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
