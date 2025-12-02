import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '../../../context/AppContext.jsx'
import validateAnswer from '../../../utils/validateAnswer.js'

export default function ExamResult() {
  const navigate = useNavigate()
  const { state, calculateScore } = useApp()

  const { correct, total, percent, scaledScore, passed, passingScore } = useMemo(() => calculateScore(), [state.userAnswers, state.examQuestions])

  const wrongQuestions = useMemo(() => {
    return (state.examQuestions || []).filter(q => !validateAnswer(state.userAnswers[q.id] || [], q.correctAnswer))
  }, [state.examQuestions, state.userAnswers])

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

  const unansweredCount = useMemo(() => {
    return (state.examQuestions || []).reduce((acc, q) => acc + ((state.userAnswers[q.id] || []).length ? 0 : 1), 0)
  }, [state.examQuestions, state.userAnswers])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 text-center sm:text-left">Exam Results</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                <span className="text-2xl font-bold">{scaledScore}/1000</span>
                <span className={`text-sm px-2.5 py-1 rounded-full ${passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {passed ? 'Passed' : 'Failed'} (≥{passingScore})
                </span>
              </div>
              <p className="text-gray-600 mt-1 text-center sm:text-left">Correct: {correct}/{total} • {percent}% • Wrong: {total - correct} • Unanswered: {unansweredCount}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
              <button className="px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold shadow-sm" onClick={() => navigate('/')}>Home</button>
              <button className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm" onClick={() => navigate('/exam/review')}>Review All</button>
              <button className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm" onClick={() => navigate('/exam')}>Retake</button>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Notes</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Your final score is scaled to 1000. A score of {passingScore}+ is considered a pass.</li>
              <li>Only incorrect questions are shown below to focus your revision.</li>
              <li>Use “Review All” to see every question with correct answers and explanations.</li>
            </ul>
          </div>

          {/* Wrong questions only */}
          <div>
            {wrongQuestions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-emerald-600 text-2xl font-bold mb-2">Great job! 🎉</div>
                <p className="text-gray-700">No incorrect answers to show.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {wrongQuestions.map((q) => {
                  const given = state.userAnswers[q.id] || []
                  return (
                    <div key={q.id} className="rounded-lg p-4 bg-red-50 shadow-sm">
                      <div className="text-xs text-red-700/80 mb-1">Question #{q.id}</div>
                      <div className="font-semibold text-gray-900 mb-2">{q.question}</div>
                      <div className="text-sm text-gray-800">
                        {q.type === 'drag-drop' ? (
                          <>
                            <div className="mb-1"><span className="font-semibold">Your answer:</span> {given.length ? formatPairs(given, q.pairs || []) : '—'}</div>
                            <div className="mb-2"><span className="font-semibold">Correct:</span> {formatPairs(q.correctAnswer || [], q.pairs || [])}</div>
                          </>
                        ) : (
                          <>
                            <div className="mb-1"><span className="font-semibold">Your answer:</span> {given.join(', ') || '—'}</div>
                            <div className="mb-2"><span className="font-semibold">Correct:</span> {(q.correctAnswer || []).join(', ')}</div>
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
