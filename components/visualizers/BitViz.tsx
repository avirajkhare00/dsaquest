'use client';
import { useState } from 'react';

type Mode = 'ops' | 'xor' | 'subsets';

const toBin = (n: number, bits = 8) => n.toString(2).padStart(bits, '0');

export default function BitViz() {
  const [mode, setMode] = useState<Mode>('ops');
  const [numA, setNumA] = useState(12);
  const [numB, setNumB] = useState(10);
  const [xorArr] = useState([2, 3, 5, 3, 2]);
  const [subNums] = useState([1, 2, 3]);
  const [currentMask, setCurrentMask] = useState(0);

  const ops = [
    { label: 'AND (&)', result: numA & numB, desc: 'Both bits must be 1', symbol: '&' },
    { label: 'OR (|)', result: numA | numB, desc: 'At least one bit is 1', symbol: '|' },
    { label: 'XOR (^)', result: numA ^ numB, desc: 'Bits are different', symbol: '^' },
    { label: 'NOT (~A)', result: (~numA) & 0xFF, desc: 'Flip all bits (8-bit)', symbol: '~' },
    { label: 'A << 1', result: (numA << 1) & 0xFF, desc: 'Multiply by 2', symbol: '<<' },
    { label: 'A >> 1', result: numA >> 1, desc: 'Divide by 2', symbol: '>>' },
  ];

  const xorResult = xorArr.reduce((a, b) => a ^ b, 0);

  const totalMasks = 1 << subNums.length;
  const currentSubset = subNums.filter((_, i) => (currentMask >> i) & 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {([['ops', '⚡ Bit Ops'], ['xor', '✨ XOR Magic'], ['subsets', '🎭 Bitmask Subsets']] as [Mode, string][]).map(([m, l]) => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === m ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {l}
          </button>
        ))}
      </div>

      {mode === 'ops' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 bg-gray-50 rounded-xl p-4">
            {[['A', numA, setNumA], ['B', numB, setNumB]].map(([label, val, setter]) => (
              <div key={label as string} className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">Number {label as string}</label>
                <input type="number" min={0} max={255} value={val as number}
                  onChange={e => (setter as (v: number) => void)(Number(e.target.value) & 0xFF)}
                  className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <span className="text-xs font-mono text-blue-600">{toBin(val as number)}</span>
              </div>
            ))}
          </div>

          {/* Binary display */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
            <BinaryRow label={`A = ${numA}`} value={numA} color="blue" />
            <BinaryRow label={`B = ${numB}`} value={numB} color="purple" />
          </div>

          {/* Operations table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ops.map(op => (
              <div key={op.label} className="bg-white border border-gray-100 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-800">{op.label}</span>
                  <span className="text-xs text-gray-500">{op.desc}</span>
                </div>
                <BinaryRow label={`= ${op.result}`} value={op.result} color="green" />
              </div>
            ))}
          </div>

          {/* Tricks */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-1">
            <p className="text-xs font-bold text-blue-700 mb-2">🎯 Bit Tricks</p>
            <p className="text-xs text-blue-800">Power of 2? <code className="bg-blue-100 px-1 rounded">{numA} & {numA - 1} = {numA & (numA - 1)}</code> → {(numA & (numA - 1)) === 0 ? '✅ YES' : '❌ NO'}</p>
            <p className="text-xs text-blue-800">Set bits in {numA}: {toBin(numA).split('').filter(b => b === '1').length} bit(s)</p>
            <p className="text-xs text-blue-800">Lowest set bit: {numA & (-numA)}</p>
          </div>
        </div>
      )}

      {mode === 'xor' && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-700">Array: <strong>[{xorArr.join(', ')}]</strong> — every element appears twice except one. Find it using XOR!</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase">XOR step-by-step</p>
            {xorArr.map((n, i) => {
              const running = xorArr.slice(0, i + 1).reduce((a, b) => a ^ b, 0);
              return (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-700 w-16">{i === 0 ? `0 ^ ${n}` : `^ ${n}`}</span>
                  <BinaryRow label={`= ${running}`} value={running} color={running === 0 ? 'red' : 'purple'} compact />
                  {running === 0 && <span className="text-xs text-red-500 font-bold">cancelled! →0</span>}
                </div>
              );
            })}
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-sm font-bold text-emerald-700">✅ Result: {xorResult} — the unique element!</p>
            <p className="text-xs text-emerald-600 mt-1">All pairs XOR to 0. Only the singleton {xorResult} remains.</p>
          </div>
        </div>
      )}

      {mode === 'subsets' && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-700">Array: <strong>[{subNums.join(', ')}]</strong> → {totalMasks} subsets (2³). Each mask = a binary number representing inclusion.</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500">Mask (0–{totalMasks - 1})</label>
            <input type="range" min={0} max={totalMasks - 1} value={currentMask}
              onChange={e => setCurrentMask(Number(e.target.value))}
              className="w-full mt-2 accent-blue-600" />
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-700">mask = {currentMask}</span>
              <span className="font-mono text-blue-600 text-sm">{toBin(currentMask, subNums.length)}</span>
            </div>
            <div className="flex gap-3">
              {subNums.map((n, i) => {
                const included = !!((currentMask >> i) & 1);
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all ${included ? 'bg-blue-200 border-blue-500 text-blue-800 scale-110' : 'bg-gray-100 border-gray-300 text-gray-400'}`}>
                      {n}
                    </div>
                    <span className={`text-xs font-mono font-bold ${included ? 'text-blue-600' : 'text-gray-400'}`}>bit {i}={((currentMask >> i) & 1)}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-sm font-bold text-gray-800">
              Subset: {currentSubset.length === 0 ? '{ }' : `{ ${currentSubset.join(', ')} }`}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: totalMasks }, (_, mask) => {
              const subset = subNums.filter((_, i) => (mask >> i) & 1);
              return (
                <button key={mask} onClick={() => setCurrentMask(mask)}
                  className={`p-2 rounded-lg text-xs font-mono border transition-all ${mask === currentMask ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                  {toBin(mask, subNums.length)}<br />
                  {'{' + subset.join(',') + '}'}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function BinaryRow({ label, value, color, compact = false }: { label: string; value: number; color: string; compact?: boolean }) {
  const bin = toBin(value & 0xFF);
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 border-blue-400 text-blue-800',
    purple: 'bg-purple-100 border-purple-400 text-purple-800',
    green: 'bg-green-100 border-green-400 text-green-800',
    red: 'bg-red-100 border-red-400 text-red-800',
  };
  const cls = colorMap[color] || colorMap.blue;
  return (
    <div className={`flex items-center gap-2 ${compact ? '' : ''}`}>
      <span className="text-xs text-gray-500 w-16 text-right font-mono">{label}</span>
      <div className="flex gap-0.5">
        {bin.split('').map((bit, i) => (
          <div key={i} className={`${compact ? 'w-5 h-5 text-xs' : 'w-7 h-7 text-xs'} rounded flex items-center justify-center font-bold border ${bit === '1' ? cls : 'bg-gray-50 border-gray-200 text-gray-300'}`}>
            {bit}
          </div>
        ))}
      </div>
    </div>
  );
}
