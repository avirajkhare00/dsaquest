'use client';

import { useState } from 'react';

const TABLE_SIZE = 8;

interface Bucket {
  key: string;
  value: string;
}

type Mode = 'insert' | 'lookup' | 'frequency' | 'twosum';

function simpleHash(key: string, size: number): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % size;
  return h;
}

const SAMPLE_WORDS = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple', 'date'];
const TWOSUM_NUMS = [2, 7, 11, 15, 3, 6];
const TWOSUM_TARGET = 9;

export default function HashTableViz() {
  const [mode, setMode] = useState<Mode>('insert');
  const [table, setTable] = useState<Bucket[][]>(Array.from({ length: TABLE_SIZE }, () => []));
  const [keyInput, setKeyInput] = useState('hello');
  const [valInput, setValInput] = useState('world');
  const [lookupKey, setLookupKey] = useState('hello');
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [foundAt, setFoundAt] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [freqMap, setFreqMap] = useState<Map<string, number> | null>(null);
  const [freqStep, setFreqStep] = useState(-1);
  const [twoSumMap, setTwoSumMap] = useState<Map<number, number> | null>(null);
  const [twoSumStep, setTwoSumStep] = useState(-1);
  const [twoSumResult, setTwoSumResult] = useState<[number, number] | null>(null);

  function handleInsert() {
    const idx = simpleHash(keyInput, TABLE_SIZE);
    const newTable = table.map(b => [...b]);
    const existing = newTable[idx].findIndex(b => b.key === keyInput);
    if (existing >= 0) newTable[idx][existing].value = valInput;
    else newTable[idx].push({ key: keyInput, value: valInput });
    setTable(newTable);
    setHighlighted(idx);
    setFoundAt(null);
    setMessage(`hash("${keyInput}") = ${idx} → stored at bucket ${idx}`);
    setTimeout(() => setHighlighted(null), 1500);
  }

  function handleLookup() {
    const idx = simpleHash(lookupKey, TABLE_SIZE);
    setHighlighted(idx);
    const item = table[idx].find(b => b.key === lookupKey);
    if (item) {
      setFoundAt(idx);
      setMessage(`hash("${lookupKey}") = ${idx} → found! value = "${item.value}"`);
    } else {
      setFoundAt(null);
      setMessage(`hash("${lookupKey}") = ${idx} → not found in bucket ${idx}`);
    }
  }

  function runFrequency() {
    const freq = new Map<string, number>();
    let step = 0;
    const steps: { word: string; freq: Map<string, number> }[] = [];
    for (const word of SAMPLE_WORDS) {
      freq.set(word, (freq.get(word) ?? 0) + 1);
      steps.push({ word, freq: new Map(freq) });
    }
    setFreqMap(steps[0].freq);
    setFreqStep(0);
    setMessage(`Processing "${steps[0].word}" → count: ${steps[0].freq.get(steps[0].word)}`);

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= steps.length) { clearInterval(interval); return; }
      setFreqMap(steps[i].freq);
      setFreqStep(i);
      setMessage(`Processing "${steps[i].word}" → count: ${steps[i].freq.get(steps[i].word)}`);
    }, 700);
  }

  function runTwoSum() {
    const seen = new Map<number, number>();
    const steps: { num: number; complement: number; seen: Map<number, number>; found?: boolean }[] = [];
    let result: [number, number] | null = null;

    for (let i = 0; i < TWOSUM_NUMS.length; i++) {
      const num = TWOSUM_NUMS[i];
      const comp = TWOSUM_TARGET - num;
      const found = seen.has(comp);
      steps.push({ num, complement: comp, seen: new Map(seen), found });
      if (found) { result = [comp, num]; break; }
      seen.set(num, i);
    }

    setTwoSumMap(steps[0].seen);
    setTwoSumStep(0);
    setTwoSumResult(null);
    setMessage(`num=${steps[0].num}, need ${steps[0].complement} — ${steps[0].found ? '🎉 Found!' : 'not in map yet, storing ' + steps[0].num}`);

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= steps.length) { clearInterval(interval); if (result) setTwoSumResult(result); return; }
      setTwoSumMap(steps[i].seen);
      setTwoSumStep(i);
      setMessage(`num=${steps[i].num}, need ${steps[i].complement} — ${steps[i].found ? `🎉 Found! ${steps[i].complement} was stored!` : 'not in map, storing ' + steps[i].num}`);
      if (steps[i].found && result) setTwoSumResult(result);
    }, 800);
  }

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="flex flex-wrap gap-2">
        {([
          ['insert', '➕ Insert'],
          ['lookup', '🔍 Lookup'],
          ['frequency', '📊 Frequency Count'],
          ['twosum', '🎯 Two Sum'],
        ] as [Mode, string][]).map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m); setMessage(''); setHighlighted(null); setFoundAt(null); setFreqMap(null); setTwoSumMap(null); setTwoSumResult(null); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === m ? 'bg-violet-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Controls */}
      {mode === 'insert' && (
        <div className="flex flex-wrap gap-3 items-end bg-gray-50 rounded-xl p-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Key</label>
            <input value={keyInput} onChange={e => setKeyInput(e.target.value)} className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Value</label>
            <input value={valInput} onChange={e => setValInput(e.target.value)} className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <button onClick={handleInsert} className="px-5 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 shadow-md shadow-violet-200">➕ Insert</button>
        </div>
      )}

      {mode === 'lookup' && (
        <div className="flex flex-wrap gap-3 items-end bg-gray-50 rounded-xl p-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Key to look up</label>
            <input value={lookupKey} onChange={e => setLookupKey(e.target.value)} className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <button onClick={handleLookup} className="px-5 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 shadow-md shadow-violet-200">🔍 Lookup</button>
        </div>
      )}

      {mode === 'frequency' && (
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-2">Words to count: <strong>[{SAMPLE_WORDS.join(', ')}]</strong></p>
          <button onClick={runFrequency} className="px-5 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 shadow-md shadow-violet-200">▶ Run Frequency Count</button>
        </div>
      )}

      {mode === 'twosum' && (
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-2">Array: <strong>[{TWOSUM_NUMS.join(', ')}]</strong> — Target: <strong>{TWOSUM_TARGET}</strong></p>
          <button onClick={runTwoSum} className="px-5 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 shadow-md shadow-violet-200">▶ Run Two Sum</button>
        </div>
      )}

      {/* Hash table visualization */}
      {(mode === 'insert' || mode === 'lookup') && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Hash Table (size {TABLE_SIZE})</p>
          {Array.from({ length: TABLE_SIZE }, (_, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all ${i === highlighted ? (foundAt === i ? 'bg-green-50 border-green-400' : 'bg-violet-50 border-violet-400') : 'bg-white border-gray-100'}`}>
              <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">{i}</span>
              <div className="flex flex-wrap gap-2 flex-1 min-h-[32px] items-center">
                {table[i].length === 0
                  ? <span className="text-xs text-gray-300 italic">empty</span>
                  : table[i].map(b => (
                    <span key={b.key} className="flex items-center gap-1 bg-violet-100 text-violet-800 text-xs font-medium px-3 py-1 rounded-full">
                      <span className="font-bold">{b.key}</span>
                      <span className="text-violet-400">→</span>
                      <span>{b.value}</span>
                    </span>
                  ))
                }
                {table[i].length > 1 && (
                  <span className="text-xs text-amber-600 font-medium">⚠️ collision</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Frequency map */}
      {mode === 'frequency' && freqMap && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Frequency Map</p>
          <div className="flex flex-wrap gap-2">
            {Array.from(freqMap.entries()).map(([word, count]) => (
              <div key={word} className="bg-violet-100 rounded-xl p-3 text-center min-w-[80px]">
                <p className="font-bold text-violet-800">{word}</p>
                <p className="text-2xl font-black text-violet-600">{count}</p>
                <div className="flex gap-0.5 mt-1 justify-center">
                  {Array.from({ length: count }, (_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-violet-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm font-semibold text-emerald-700">
            Most frequent: <strong>{Array.from(freqMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0]}</strong> ({Array.from(freqMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[1]}x)
          </p>
        </div>
      )}

      {/* Two Sum map */}
      {mode === 'twosum' && twoSumMap !== null && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">HashMap (value → index)</p>
          <div className="flex flex-wrap gap-2">
            {TWOSUM_NUMS.map((num, i) => {
              const inMap = twoSumMap.has(num);
              const isResult = twoSumResult && (num === twoSumResult[0] || num === twoSumResult[1]);
              return (
                <div key={i} className={`rounded-xl p-3 text-center border-2 transition-all ${isResult ? 'bg-green-100 border-green-400' : inMap ? 'bg-violet-100 border-violet-300' : 'bg-gray-50 border-gray-200'}`}>
                  <p className="text-xs text-gray-500">idx {i}</p>
                  <p className={`text-xl font-black ${isResult ? 'text-green-700' : inMap ? 'text-violet-700' : 'text-gray-400'}`}>{num}</p>
                  {inMap && <p className="text-xs text-violet-500 font-medium">stored ✓</p>}
                  {isResult && <p className="text-xs text-green-600 font-bold">match! ✅</p>}
                </div>
              );
            })}
          </div>
          {twoSumResult && (
            <p className="text-sm font-bold text-emerald-700">
              ✅ {twoSumResult[0]} + {twoSumResult[1]} = {TWOSUM_TARGET}!
            </p>
          )}
        </div>
      )}

      {/* Message */}
      {message && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-800 font-medium">{message}</p>
        </div>
      )}
    </div>
  );
}
