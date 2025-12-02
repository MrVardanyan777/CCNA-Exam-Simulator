import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '../../../context/AppContext.jsx'
import selectRandom from '../../../utils/selectRandom.js'

export default function ExamSetup() {
  const navigate = useNavigate()
  const { questionsData, startExam } = useApp()
  // Category selection
  const categories = useMemo(() => {
    const set = new Set(questionsData.map(q => q.category).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [questionsData])
  const [category, setCategory] = useState('All')

  // Derived list based on category
  const filtered = useMemo(() => {
    return category === 'All' ? questionsData : questionsData.filter(q => q.category === category)
  }, [questionsData, category])

  // Number of questions: predefined options via buttons
  const questionOptions = [30, 50, 60, 'All']
  const [questionCount, setQuestionCount] = useState(
    filtered.length >= 50 ? 50 : Math.min(30, filtered.length)
  )

  // Timer options via buttons (minutes)
  const timerOptions = [30, 60, 100, 120]
  const [timer, setTimer] = useState(90)

  const handleStart = () => {
    const pool = filtered
    const desired = questionCount === 'All' ? pool.length : Number(questionCount)
    const count = Math.max(1, Math.min(desired, pool.length))
    const list = selectRandom(pool, count)
    startExam(list, { totalQuestions: count, timer })
    navigate('/exam/start')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900">Exam Setup</h1>

        <div className="space-y-8 bg-white rounded-xl p-6 shadow-md">
          {/* Category selection */}
          <div>
            <label className="block text-lg font-semibold mb-3 text-center text-gray-900">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map(cat => {
                const active = category === cat
                return (
                  <button
                    key={cat}
                    className={`w-full px-4 py-3 rounded-lg text-base font-semibold transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ${active ? 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500' : 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400'}`}
                    onClick={() => {
                      setCategory(cat)
                      // Reset question count to a valid option for new pool
                      const poolSize = (cat === 'All' ? questionsData.length : questionsData.filter(q => q.category === cat).length)
                      if (questionCount !== 'All' && Number(questionCount) > poolSize) {
                        // pick the largest option that fits, else 'All'
                        const fit = questionOptions.findLast(opt => opt !== 'All' && opt <= poolSize)
                        setQuestionCount(fit || 'All')
                      }
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Number of questions */}
          <div>
            <label className="block text-lg font-semibold mb-3 text-center text-gray-900">Number of questions</label>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {questionOptions.map(opt => {
                const active = questionCount === opt
                const poolSize = filtered.length
                const disabled = opt !== 'All' && opt > poolSize
                return (
                  <button
                    key={String(opt)}
                    disabled={disabled}
                    className={`px-4 py-3 rounded-lg text-base font-semibold transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ${active ? 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500' : 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400'} ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    onClick={() => setQuestionCount(opt)}
                  >
                    {opt === 'All' ? `All (${poolSize})` : opt}
                  </button>
                )
              })}
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">Available in selected category: {filtered.length}</p>
          </div>

          {/* Timer selection */}
          <div>
            <label className="block text-lg font-semibold mb-3 text-center text-gray-900">Timer (minutes)</label>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {timerOptions.map(opt => {
                const active = timer === opt
                return (
                  <button
                    key={opt}
                    className={`px-4 py-3 rounded-lg text-base font-semibold transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ${active ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500' : 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400'}`}
                    onClick={() => setTimer(opt)}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-base font-semibold shadow-sm" onClick={() => navigate('/')}>Back</button>
            <button className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-base font-semibold shadow-sm" onClick={handleStart}>Start Exam</button>
          </div>
        </div>
      </div>
    </div>
  )
}
