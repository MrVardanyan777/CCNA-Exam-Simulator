import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '../../../context/AppContext.jsx'
import validateAnswer from '../../../utils/validateAnswer.js'

export default function ExamReview() {
  const navigate = useNavigate()
  const { state, calculateScore } = useApp()
  const { correct, total, percent, scaledScore, passed, passingScore } = useMemo(() => calculateScore(), [state.userAnswers, state.examQuestions])

  const formatPairs = (tokens = [], pairs = []) => {
    const parse = (t = '') => {
      const m = /^L(\d+):R(\d+)$/.exec(t)
      if (!m) return null
      return { l: Number(m[1]), r: Number(m[2]) }
    }
    const parts = []
    for (const t of tokens) {
      const pr = parse(t)
      if (pr && pairs[pr.l] && pairs[pr.r]) {
        parts.push(`${pairs[pr.l].left} → ${pairs[pr.r].right}`)
      } else {
        parts.push(t)
      }
    }
    return parts.join(', ')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Exam Review</h1>
            <div className="mt-1 flex items-center gap-3">
              <span className="text-lg font-semibold">{scaledScore}/1000</span>
              <span className={`text-sm px-2 py-0.5 rounded ${passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {passed ? 'Passed' : 'Failed'} (≥{passingScore})
              </span>
            </div>
            <p className="text-gray-600 mt-1">Raw: {correct}/{total} correct ({percent}%)</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded border" onClick={() => navigate('/')}>Home</button>
            <button className="px-4 py-2 rounded border" onClick={() => navigate('/exam')}>Retake</button>
          </div>
        </div>

        <div className="space-y-4">
          {state.examQuestions.map((q, i) => {
            const given = state.userAnswers[q.id] || []
            const isCorrect = validateAnswer(given, q.correctAnswer)
            return (
              <div key={q.id} className={`rounded border p-4 ${isCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-red-300 bg-red-50'}`}>
                <div className="text-sm text-gray-600 mb-1">Q{i + 1}</div>
                <div className="font-medium mb-2">{q.question}</div>
                <div className="text-sm">
                  {q.type === 'drag-drop' ? (
                    <>
                      <div className="mb-1"><span className="font-semibold">Your answer:</span> {given.length ? formatPairs(given, q.pairs || []) : '—'}</div>
                      <div className="mb-2"><span className="font-semibold">Correct:</span> {formatPairs(q.correctAnswer || [], q.pairs || [])}</div>
                    </>
                  ) : (
                    <>
                      <div className="mb-1"><span className="font-semibold">Your answer:</span> {given.join(', ') || '—'}</div>
                      <div className="mb-2"><span className="font-semibold">Correct:</span> {q.correctAnswer.join(', ')}</div>
                    </>
                  )}
                  {q.explanation && (
                    <div className="text-gray-700"><span className="font-semibold">Explanation:</span> {q.explanation}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
