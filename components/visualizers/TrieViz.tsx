'use client';
import { useState } from 'react';

interface TrieNode { children: Map<string, TrieNode>; isEnd: boolean }
const newNode = (): TrieNode => ({ children: new Map(), isEnd: false });

function buildInitialTrie(words: string[]): TrieNode {
  const root = newNode();
  for (const word of words) {
    let node = root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, newNode());
      node = node.children.get(ch)!;
    }
    node.isEnd = true;
  }
  return root;
}

const SAMPLE_WORDS = ['app', 'apple', 'apply', 'apt', 'bat', 'ball', 'ban'];

interface NodePos { id: string; char: string; x: number; y: number; isEnd: boolean; parentId?: string }

function getPositions(root: TrieNode): NodePos[] {
  const positions: NodePos[] = [];
  let idCounter = 0;
  const W = 380;
  function traverse(node: TrieNode, depth: number, left: number, right: number, parentId?: string, char = '') {
    const x = (left + right) / 2;
    const y = depth * 55 + 25;
    const id = `node-${idCounter++}`;
    if (char) positions.push({ id, char, x, y, isEnd: node.isEnd, parentId });
    const children = Array.from(node.children.entries()).sort();
    const step = (right - left) / Math.max(children.length, 1);
    children.forEach(([ch, child], i) => {
      traverse(child, depth + 1, left + i * step, left + (i + 1) * step, char ? id : undefined, ch);
    });
    if (!char) {
      // root
      const rootId = `root`;
      positions.unshift({ id: rootId, char: '·', x: W / 2, y: 20, isEnd: false });
      children.forEach(([ch, child], i) => {
        const pos = positions.find(p => p.char === ch && p.parentId === undefined);
        if (pos) pos.parentId = rootId;
      });
    }
  }
  traverse(root, 0, 0, W);
  return positions;
}

type Mode = 'insert' | 'search' | 'prefix';

export default function TrieViz() {
  const [words, setWords] = useState<string[]>(SAMPLE_WORDS);
  const [trie, setTrie] = useState<TrieNode>(() => buildInitialTrie(SAMPLE_WORDS));
  const [mode, setMode] = useState<Mode>('search');
  const [input, setInput] = useState('app');
  const [highlighted, setHighlighted] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [positions, setPositions] = useState<NodePos[]>(() => getPositions(buildInitialTrie(SAMPLE_WORDS)));

  function rebuild(newWords: string[]) {
    const t = buildInitialTrie(newWords);
    setTrie(t);
    setPositions(getPositions(t));
  }

  function handleInsert() {
    if (!input.trim()) return;
    const newWords = [...new Set([...words, input.toLowerCase()])];
    setWords(newWords);
    rebuild(newWords);
    setMessage(`✅ Inserted "${input}"`);
    setHighlighted([]);
    setResults([]);
  }

  function handleSearch() {
    const path: string[] = [];
    let node = trie;
    for (const ch of input.toLowerCase()) {
      if (!node.children.has(ch)) {
        setMessage(`❌ "${input}" not found — no path for '${ch}'`);
        setHighlighted(path);
        setResults([]);
        return;
      }
      node = node.children.get(ch)!;
      path.push(ch);
    }
    if (node.isEnd) {
      setMessage(`✅ Found "${input}" — it's a complete word!`);
    } else {
      setMessage(`⚠️ "${input}" exists as a prefix but not as a complete word`);
    }
    setHighlighted(path);
    setResults([]);
  }

  function handlePrefix() {
    const path: string[] = [];
    let node = trie;
    for (const ch of input.toLowerCase()) {
      if (!node.children.has(ch)) { setMessage(`❌ No words with prefix "${input}"`); setHighlighted([]); setResults([]); return; }
      node = node.children.get(ch)!;
      path.push(ch);
    }
    setHighlighted(path);
    const found: string[] = [];
    function dfs(n: TrieNode, cur: string) {
      if (n.isEnd) found.push(cur);
      for (const [ch, child] of n.children) dfs(child, cur + ch);
    }
    dfs(node, input.toLowerCase());
    setResults(found);
    setMessage(`🔍 Found ${found.length} word(s) with prefix "${input}"`);
  }

  // Find highlighted path nodes in positions
  const highlightedNodes = new Set<string>();
  {
    let node = trie;
    let prev = 'root';
    for (const ch of input.toLowerCase()) {
      if (!node.children.has(ch)) break;
      const pos = positions.find(p => p.char === ch && p.parentId === prev);
      if (pos) { highlightedNodes.add(pos.id); prev = pos.id; }
      node = node.children.get(ch)!;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(['search', 'prefix', 'insert'] as Mode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setMessage(''); setHighlighted([]); setResults([]); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === m ? 'bg-teal-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {m === 'search' ? '🔍 Search' : m === 'prefix' ? '🌿 Autocomplete' : '➕ Insert'}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500">{mode === 'insert' ? 'Word to insert' : mode === 'search' ? 'Word to search' : 'Prefix'}</label>
          <input value={input} onChange={e => setInput(e.target.value)} className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        </div>
        <button onClick={() => mode === 'insert' ? handleInsert() : mode === 'search' ? handleSearch() : handlePrefix()}
          className="px-5 py-2 bg-teal-500 text-white rounded-lg text-sm font-semibold hover:bg-teal-600 shadow-md shadow-teal-200">
          ▶ Run
        </button>
        <div className="text-xs text-gray-500">Words: {words.join(', ')}</div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
        <svg width="380" height="280" viewBox="0 0 380 280" className="mx-auto">
          {positions.map(pos => pos.parentId && (() => {
            const parent = positions.find(p => p.id === pos.parentId);
            if (!parent) return null;
            return <line key={`e-${pos.id}`} x1={parent.x} y1={parent.y} x2={pos.x} y2={pos.y} stroke="#e5e7eb" strokeWidth="1.5" />;
          })())}
          {positions.map(pos => {
            const isHighlighted = highlightedNodes.has(pos.id) || pos.id === 'root';
            const fill = isHighlighted ? '#ccfbf1' : '#f0fdf4';
            const stroke = isHighlighted ? '#0d9488' : '#6ee7b7';
            const textColor = isHighlighted ? '#0f766e' : '#15803d';
            return (
              <g key={pos.id}>
                <circle cx={pos.x} cy={pos.y} r={16} fill={fill} stroke={stroke} strokeWidth={isHighlighted ? 2.5 : 1.5}
                  style={{ transition: 'all 0.3s' }} />
                <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="12" fontWeight="bold" fill={textColor}>{pos.char}</text>
                {pos.isEnd && <circle cx={pos.x + 12} cy={pos.y - 12} r={4} fill="#f59e0b" />}
              </g>
            );
          })}
        </svg>
        <p className="text-xs text-center text-gray-400 pb-2">🟡 dot = end of a word</p>
      </div>

      {message && <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-sm text-gray-800">{message}</p></div>}

      {results.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {results.map(r => <span key={r} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">{r}</span>)}
        </div>
      )}
    </div>
  );
}
