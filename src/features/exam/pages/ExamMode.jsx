import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '../../../context/AppContext.jsx'
import DragMatch from '../../../components/UI/DragMatch.jsx'

export default function ExamMode() {
  const navigate = useNavigate()
  const { state, answerQuestion, nextQuestion, calculateScore } = useApp()
  const questions = state.examQuestions
  const idx = state.currentQuestionIndex
  const q = questions[idx]

  // Timer setup
  const totalSeconds = useMemo(() => Math.max(1, (state.examSettings?.timer || 90) * 60), [state.examSettings?.timer])
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!questions.length) {
      navigate('/exam')
      return
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => prev - 1)
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [questions.length, navigate])

  useEffect(() => {
    if (secondsLeft <= 0) {
      clearInterval(intervalRef.current)
      navigate('/exam/result')
    }
  }, [secondsLeft, navigate])

  if (!q) return null

  const [selected, setSelected] = useState(state.userAnswers[q.id] || [])
  const isDrag = q.type === 'drag-drop'
  const isMulti = !isDrag && Array.isArray(q.correctAnswer) && q.correctAnswer.length > 1
  // Image source with fallback (png -> jpg -> jpeg -> webp)
  const defaultPng = q.hasImage ? (q.imagePath || `/question-${q.id}.png`) : ''
  const [imgSrc, setImgSrc] = useState(defaultPng)
  useEffect(() => {
    setImgSrc(defaultPng)
  }, [defaultPng, q?.id])
  const onImgError = () => {
    if (!imgSrc) return
    if (imgSrc.endsWith('.png')) setImgSrc(imgSrc.replace('.png', '.jpg'))
    else if (imgSrc.endsWith('.jpg')) setImgSrc(imgSrc.replace('.jpg', '.jpeg'))
    else if (imgSrc.endsWith('.jpeg')) setImgSrc(imgSrc.replace('.jpeg', '.webp'))
  }

  useEffect(() => {
    setSelected(state.userAnswers[q?.id] || [])
  }, [q?.id, state.userAnswers])

  const onSelect = (key) => {
    if (isDrag) return
    if (isMulti) {
      const exists = selected.includes(key)
      const next = exists ? selected.filter(k => k !== key) : [...selected, key]
      setSelected(next)
      answerQuestion(q.id, next)
    } else {
      const next = [key]
      setSelected(next)
      answerQuestion(q.id, next)
    }
  }

  const goNext = () => {
    if (idx >= questions.length - 1) {
      navigate('/exam/result')
    } else {
      nextQuestion()
    }
  }

  const mm = Math.floor(secondsLeft / 60)
  const ss = String(secondsLeft % 60).padStart(2, '0')

  const canGoNext = isDrag ? (Array.isArray(selected) && q.pairs && selected.length === q.pairs.length) : selected.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1.5 rounded border border-gray-300 bg-white text-sm hover:bg-gray-50"
              onClick={() => {
                const confirmExit = window.confirm('Exit the exam? Your current progress will be lost.')
                if (!confirmExit) return
                if (intervalRef.current) clearInterval(intervalRef.current)
                navigate('/exam')
              }}
            >
              ← Back
            </button>
            <div className="text-sm text-gray-600">Question {idx + 1} / {questions.length}</div>
          </div>
          <div className="text-sm font-mono px-3 py-1 rounded bg-gray-900 text-white">{mm}:{ss}</div>
        </div>

        <h2 className="text-lg font-semibold mb-4">{q.question}</h2>
        {q.hasImage && (
          <div className="flex justify-center mb-4">
            <img src={imgSrc} onError={onImgError} alt={`Question ${q.id}`} className="max-h-72 object-contain" />
          </div>
        )}
        {q.type !== 'drag-drop' ? (
          <div className="space-y-2">
            {Object.entries(q.options).map(([key, text]) => (
              <button key={key} className={`w-full text-left rounded border p-3 ${selected.includes(key) ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`} onClick={() => onSelect(key)}>
                <span className="font-mono mr-2">{key}.</span>{text}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-2">
            <DragMatch
              pairs={q.pairs || []}
              value={selected}
              onChange={(tokens) => { setSelected(tokens); answerQuestion(q.id, tokens) }}
            />
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button className="ml-auto px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-50" disabled={!canGoNext} onClick={goNext}>
            {idx >= questions.length - 1 ? 'Finish Exam' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
