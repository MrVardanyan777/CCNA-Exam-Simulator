import { useEffect, useMemo, useState } from 'react'
import shuffle from '../../utils/shuffle.js'

// Token helpers: encode/decode stable mapping tokens like "L0:R2"
const makeToken = (lIndex, rIndex) => `L${lIndex}:R${rIndex}`
const parseToken = (t = '') => {
  const m = /^L(\d+):R(\d+)$/.exec(t)
  if (!m) return null
  return { l: Number(m[1]), r: Number(m[2]) }
}

export default function DragMatch({ pairs = [], value = [], onChange, reveal = false, correctTokens = [] }) {
  // Build assigned map from value tokens
  const initialAssigned = useMemo(() => {
    const arr = Array(pairs.length).fill(null)
    for (const t of value) {
      const pr = parseToken(t)
      if (!pr) continue
      if (pr.l >= 0 && pr.l < pairs.length) arr[pr.l] = pr.r
    }
    return arr
  }, [pairs.length, value])

  const [assigned, setAssigned] = useState(initialAssigned)
  const [shuffledRight, setShuffledRight] = useState(() => shuffle(pairs.map((p, i) => ({ idx: i, text: p.right }))))

  useEffect(() => {
    setAssigned(initialAssigned)
    // Keep shuffledRight stable once created per question to avoid moving targets
  }, [initialAssigned])

  const unassignedRight = useMemo(() => {
    const used = new Set(assigned.filter(v => v !== null))
    return shuffledRight.filter(item => !used.has(item.idx))
  }, [assigned, shuffledRight])

  const commit = (nextAssigned) => {
    setAssigned(nextAssigned)
    if (onChange) {
      const tokens = nextAssigned
        .map((rIdx, lIdx) => (rIdx === null ? null : makeToken(lIdx, rIdx)))
        .filter(Boolean)
      onChange(tokens)
    }
  }

  // Drag handlers
  const onDragStart = (e, rIdx) => {
    e.dataTransfer.setData('text/plain', String(rIdx))
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDropOnLeft = (e, lIdx) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('text/plain')
    const rIdx = Number(data)
    if (Number.isNaN(rIdx)) return
    const next = [...assigned]
    // unassign previous slot that had this rIdx
    const prevL = next.findIndex(x => x === rIdx)
    if (prevL !== -1) next[prevL] = null
    next[lIdx] = rIdx
    commit(next)
  }

  const onRemove = (lIdx) => {
    const next = [...assigned]
    next[lIdx] = null
    commit(next)
  }

  const allowDrop = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const isCorrectSlot = (lIdx) => {
    if (!reveal) return null
    const expected = correctTokens.find(t => parseToken(t)?.l === lIdx)
    const exp = expected ? parseToken(expected).r : null
    const got = assigned[lIdx]
    return exp !== null && got === exp
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Left panel */}
      <div className="rounded-lg border bg-blue-50/60 border-blue-100 p-3">
        <div className="text-sm font-medium mb-2 text-blue-800">Match these</div>
        <div className="space-y-2 max-h-96 overflow-auto pr-1">
          {pairs.map((p, lIdx) => {
            const rIdx = assigned[lIdx]
            const correct = isCorrectSlot(lIdx)
            let slotClasses = 'border-gray-200 bg-white'
            if (reveal) {
              if (correct === true) slotClasses = 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200'
              else if (rIdx !== null) slotClasses = 'border-red-400 bg-red-50 ring-2 ring-red-200'
              else slotClasses = 'border-gray-200 bg-white opacity-75'
            }
            return (
              <div key={lIdx}
                   onDrop={(e) => onDropOnLeft(e, lIdx)}
                   onDragOver={allowDrop}
                   className={`flex items-center justify-between rounded border p-3 min-h-12 ${slotClasses}`}>
                <div className="mr-2 text-gray-800">{p.left}</div>
                <div className="flex items-center gap-2">
                  {rIdx !== null ? (
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-2 rounded px-2 py-1 text-sm border ${reveal
                        ? (correct === true
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                          : 'bg-red-100 border-red-300 text-red-900')
                        : 'bg-blue-100 border-blue-300 text-blue-900'}`}>
                        {pairs[rIdx]?.right}
                        {reveal && (
                          <span className={`font-bold ${correct === true ? 'text-emerald-600' : 'text-red-600'}`} aria-hidden>
                            {correct === true ? '✓' : '✕'}
                          </span>
                        )}
                      </span>
                      {!reveal && (
                        <button className="text-xs text-gray-600 underline" onClick={() => onRemove(lIdx)}>remove</button>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">drop here</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right panel */}
      <div className="rounded-lg border bg-indigo-50/60 border-indigo-100 p-3">
        <div className="text-sm font-medium mb-2 text-indigo-800">Options</div>
        <div className="flex flex-wrap gap-2 max-h-96 overflow-auto">
          {unassignedRight.map(item => (
            <div key={item.idx}
                 draggable={!reveal}
                 onDragStart={(e) => onDragStart(e, item.idx)}
                 className={`cursor-move select-none inline-block rounded px-3 py-2 border text-sm ${reveal ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-gray-300 hover:bg-gray-50'}`}>
              {item.text}
            </div>
          ))}
          {!unassignedRight.length && (
            <div className="text-xs text-gray-500">All options are placed</div>
          )}
        </div>
      </div>
    </div>
  )
}
