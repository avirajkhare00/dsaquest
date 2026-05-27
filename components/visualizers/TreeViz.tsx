'use client';

import { useState } from 'react';

interface TreeNode {
  val: number;
  left?: TreeNode;
  right?: TreeNode;
}

type Mode = 'inorder' | 'preorder' | 'postorder' | 'bfs' | 'search' | 'insert';

// Build a sample BST
function buildSampleBST(): TreeNode {
  const root: TreeNode = { val: 8 };
  const insertBST = (node: TreeNode, val: number) => {
    if (val < node.val) {
      if (!node.left) node.left = { val };
      else insertBST(node.left, val);
    } else {
      if (!node.right) node.right = { val };
      else insertBST(node.right, val);
    }
  };
  [4, 12, 2, 6, 10, 14, 1, 3, 5, 7].forEach(v => insertBST(root, v));
  return root;
}

// Get node positions for rendering (layered tree layout)
interface NodePos { val: number; x: number; y: number; id: string; parentId?: string }

function getPositions(root: TreeNode): NodePos[] {
  const positions: NodePos[] = [];
  const W = 320, levelH = 70;

  function traverse(node: TreeNode, depth: number, left: number, right: number, parentId?: string) {
    const x = (left + right) / 2;
    const y = depth * levelH + 30;
    const id = `node-${node.val}`;
    positions.push({ val: node.val, x, y, id, parentId });
    if (node.left) traverse(node.left, depth + 1, left, x, id);
    if (node.right) traverse(node.right, depth + 1, x, right, id);
  }

  traverse(root, 0, 0, W);
  return positions;
}

interface Step {
  highlighted: number[];
  visiting: number | null;
  path: number[];
  message: string;
}

export default function TreeViz() {
  const [bst] = useState<TreeNode>(() => buildSampleBST());
  const [positions] = useState<NodePos[]>(() => getPositions(buildSampleBST()));
  const [mode, setMode] = useState<Mode>('inorder');
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [searchVal, setSearchVal] = useState(6);
  const [insertVal, setInsertVal] = useState(9);
  const [hasRun, setHasRun] = useState(false);
  const [insertedNodes, setInsertedNodes] = useState<NodePos[]>([]);

  const currentStep = steps[stepIdx];

  function runTraversal(traversalMode: 'inorder' | 'preorder' | 'postorder') {
    const visitOrder: number[] = [];
    const newSteps: Step[] = [];

    function inorder(node: TreeNode | undefined) {
      if (!node) return;
      inorder(node.left);
      visitOrder.push(node.val);
      newSteps.push({ highlighted: [], visiting: node.val, path: [...visitOrder], message: `Visit ${node.val} — in-order result so far: [${visitOrder.join(', ')}]` });
      inorder(node.right);
    }

    function preorder(node: TreeNode | undefined) {
      if (!node) return;
      visitOrder.push(node.val);
      newSteps.push({ highlighted: [], visiting: node.val, path: [...visitOrder], message: `Visit ${node.val} (root first) — pre-order: [${visitOrder.join(', ')}]` });
      preorder(node.left);
      preorder(node.right);
    }

    function postorder(node: TreeNode | undefined) {
      if (!node) return;
      postorder(node.left);
      postorder(node.right);
      visitOrder.push(node.val);
      newSteps.push({ highlighted: [], visiting: node.val, path: [...visitOrder], message: `Visit ${node.val} (children first) — post-order: [${visitOrder.join(', ')}]` });
    }

    if (traversalMode === 'inorder') inorder(bst);
    else if (traversalMode === 'preorder') preorder(bst);
    else postorder(bst);

    newSteps.push({ highlighted: visitOrder, visiting: null, path: visitOrder, message: `✅ ${traversalMode} complete: [${visitOrder.join(', ')}]` });
    setSteps(newSteps); setStepIdx(0); setHasRun(true);
  }

  function runBFS() {
    const queue = [bst];
    const levels: number[][] = [];
    const newSteps: Step[] = [];
    const visited: number[] = [];

    while (queue.length) {
      const level: number[] = [];
      const size = queue.length;
      for (let i = 0; i < size; i++) {
        const node = queue.shift()!;
        level.push(node.val);
        visited.push(node.val);
        newSteps.push({ highlighted: [...visited], visiting: node.val, path: [...visited], message: `BFS: visiting ${node.val} (Level ${levels.length + 1})` });
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
      levels.push(level);
    }

    newSteps.push({ highlighted: visited, visiting: null, path: visited, message: `✅ BFS complete! Level order: ${levels.map(l => `[${l.join(',')}]`).join(' → ')}` });
    setSteps(newSteps); setStepIdx(0); setHasRun(true);
  }

  function runSearch(target: number) {
    const newSteps: Step[] = [];
    const path: number[] = [];

    function search(node: TreeNode | undefined): boolean {
      if (!node) {
        newSteps.push({ highlighted: [], visiting: null, path: [...path], message: `❌ ${target} not found in tree!` });
        return false;
      }
      path.push(node.val);
      newSteps.push({ highlighted: [], visiting: node.val, path: [...path], message: `Checking ${node.val}: ${target === node.val ? 'FOUND! 🎉' : target < node.val ? `${target} < ${node.val}, go LEFT` : `${target} > ${node.val}, go RIGHT`}` });
      if (target === node.val) {
        newSteps.push({ highlighted: path, visiting: node.val, path: [...path], message: `✅ Found ${target} in ${path.length} steps! Path: ${path.join(' → ')}` });
        return true;
      }
      return target < node.val ? search(node.left) : search(node.right);
    }

    search(bst);
    setSteps(newSteps); setStepIdx(0); setHasRun(true);
  }

  function runInsert(val: number) {
    const newSteps: Step[] = [];
    const path: number[] = [];
    let insertedNode: TreeNode = bst;

    function findInsertPos(node: TreeNode): void {
      path.push(node.val);
      newSteps.push({ highlighted: [], visiting: node.val, path: [...path], message: `${val} vs ${node.val}: go ${val < node.val ? 'LEFT' : 'RIGHT'}` });
      if (val < node.val) {
        if (!node.left) {
          newSteps.push({ highlighted: [val], visiting: val, path: [...path, val], message: `✅ Inserted ${val} as left child of ${node.val}!` });
        } else findInsertPos(node.left);
      } else {
        if (!node.right) {
          newSteps.push({ highlighted: [val], visiting: val, path: [...path, val], message: `✅ Inserted ${val} as right child of ${node.val}!` });
        } else findInsertPos(node.right);
      }
    }

    findInsertPos(bst);
    setSteps(newSteps); setStepIdx(0); setHasRun(true);
  }

  const getNodeColor = (val: number) => {
    if (!hasRun || !currentStep) return { fill: '#e0e7ff', stroke: '#6366f1', text: '#4338ca' };
    if (currentStep.visiting === val) return { fill: '#fde68a', stroke: '#f59e0b', text: '#92400e' };
    if (currentStep.highlighted.includes(val)) return { fill: '#d1fae5', stroke: '#10b981', text: '#065f46' };
    if (currentStep.path.includes(val)) return { fill: '#fce7f3', stroke: '#ec4899', text: '#9d174d' };
    return { fill: '#e0e7ff', stroke: '#6366f1', text: '#4338ca' };
  };

  const posMap = Object.fromEntries(positions.map(p => [p.val, p]));

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="flex flex-wrap gap-2">
        {([
          ['inorder', '↙ In-order'],
          ['preorder', '⬆ Pre-order'],
          ['postorder', '⬇ Post-order'],
          ['bfs', '🌊 BFS'],
          ['search', '🔍 Search'],
          ['insert', '➕ Insert'],
        ] as [Mode, string][]).map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m); setSteps([]); setHasRun(false); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${mode === m ? 'bg-emerald-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-end">
        {mode === 'search' && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Search value</label>
            <input type="number" value={searchVal} onChange={e => setSearchVal(Number(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400" />
          </div>
        )}
        {mode === 'insert' && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Insert value</label>
            <input type="number" value={insertVal} onChange={e => setInsertVal(Number(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400" />
          </div>
        )}
        <button
          onClick={() => {
            if (mode === 'inorder' || mode === 'preorder' || mode === 'postorder') runTraversal(mode);
            else if (mode === 'bfs') runBFS();
            else if (mode === 'search') runSearch(searchVal);
            else runInsert(insertVal);
          }}
          className="px-5 py-2 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-200"
        >
          ▶ Run
        </button>
      </div>

      {/* Tree SVG */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
        <svg width="320" height="340" viewBox="0 0 320 340" className="mx-auto">
          {/* Draw edges */}
          {positions.map(pos => {
            if (!pos.parentId) return null;
            const parent = positions.find(p => p.id === pos.parentId);
            if (!parent) return null;
            return (
              <line key={`edge-${pos.val}`}
                x1={parent.x} y1={parent.y}
                x2={pos.x} y2={pos.y}
                stroke="#e5e7eb" strokeWidth="2" />
            );
          })}
          {/* Draw nodes */}
          {positions.map(pos => {
            const colors = getNodeColor(pos.val);
            return (
              <g key={`node-${pos.val}`}>
                <circle cx={pos.x} cy={pos.y} r="16"
                  fill={colors.fill} stroke={colors.stroke} strokeWidth="2"
                  style={{ transition: 'fill 0.3s, stroke 0.3s' }} />
                <text x={pos.x} y={pos.y + 5} textAnchor="middle"
                  fontSize="12" fontWeight="bold" fill={colors.text}>
                  {pos.val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Step info */}
      {hasRun && currentStep && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-800">{currentStep.message}</p>
          {currentStep.path.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {currentStep.path.map((v, i) => (
                <span key={i} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                  {v}
                </span>
              ))}
            </div>
          )}
          <div className="mt-3 flex items-center gap-3">
            <button onClick={() => setStepIdx(p => Math.max(0, p - 1))} disabled={stepIdx === 0}
              className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200">← Prev</button>
            <span className="text-xs text-gray-500">Step {stepIdx + 1} / {steps.length}</span>
            <button onClick={() => setStepIdx(p => Math.min(steps.length - 1, p + 1))} disabled={stepIdx === steps.length - 1}
              className="px-3 py-1.5 text-xs bg-emerald-100 text-emerald-700 rounded-lg disabled:opacity-40 hover:bg-emerald-200">Next →</button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
        {[
          { fill: '#e0e7ff', stroke: '#6366f1', label: 'Unvisited' },
          { fill: '#fde68a', stroke: '#f59e0b', label: 'Currently visiting' },
          { fill: '#fce7f3', stroke: '#ec4899', label: 'Search path' },
          { fill: '#d1fae5', stroke: '#10b981', label: 'Visited / Found' },
        ].map(({ fill, stroke, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <svg width="16" height="16"><circle cx="8" cy="8" r="7" fill={fill} stroke={stroke} strokeWidth="2" /></svg>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* BST property info */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
        <p className="text-xs font-bold text-emerald-700 mb-1">📐 BST Property</p>
        <p className="text-xs text-emerald-800">For every node: <strong>left subtree</strong> values &lt; node value &lt; <strong>right subtree</strong> values. In-order traversal gives: 1,2,3,4,5,6,7,8,10,12,14 ✓</p>
      </div>
    </div>
  );
}
