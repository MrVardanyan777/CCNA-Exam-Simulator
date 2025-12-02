import { createContext, useContext, useMemo, useReducer } from 'react'
import questionsData from '../data/questions.js'
import scoreExam, { DEFAULT_PASSING_SCORE } from '../utils/scoreExam.js'

const AppContext = createContext(null)

const initialState = {
  mode: 'practice',
  category: '',
  practiceQuestions: [],
  examQuestions: [],
  currentQuestionIndex: 0,
  userAnswers: {}, // { [questionId]: ["A"] }
  examSettings: { totalQuestions: 10, timer: 90 },
  showAnswer: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload }
    case 'SET_CATEGORY':
      return { ...state, category: action.payload }
    case 'SET_PRACTICE_QUESTIONS':
      return { ...state, practiceQuestions: action.payload, currentQuestionIndex: 0, showAnswer: false }
    case 'SET_EXAM_QUESTIONS':
      return { ...state, examQuestions: action.payload, currentQuestionIndex: 0, userAnswers: {}, showAnswer: false }
    case 'SET_EXAM_SETTINGS':
      return { ...state, examSettings: { ...state.examSettings, ...action.payload } }
    case 'ANSWER_QUESTION': {
      const { questionId, answer } = action.payload
      return { ...state, userAnswers: { ...state.userAnswers, [questionId]: answer } }
    }
    case 'NEXT_QUESTION':
      return { ...state, currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, getActiveQuestions(state).length - 1), showAnswer: false }
    case 'PREV_QUESTION':
      return { ...state, currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0) }
    case 'TOGGLE_SHOW_ANSWER':
      return { ...state, showAnswer: !state.showAnswer }
    case 'RESET_INDEX':
      return { ...state, currentQuestionIndex: 0, showAnswer: false }
    default:
      return state
  }
}

function getActiveQuestions(state) {
  return state.mode === 'exam' ? state.examQuestions : state.practiceQuestions
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Ensure every question with hasImage has a usable imagePath pointing to /question-{id}.ext by default
  // Also normalize drag-drop questions: if type === 'drag-drop' and pairs present, create a stable correctAnswer token array
  const processedQuestions = useMemo(() => {
    return (questionsData || []).map(q => {
      let next = q
      if (q?.hasImage && !q?.imagePath) {
        next = { ...next, imagePath: `/question-${q.id}.png` }
      }
      if (q?.type === 'drag-drop' && Array.isArray(q.pairs) && q.pairs.length) {
        // Build default correctAnswer as L{i}:R{i} tokens if not provided
        if (!Array.isArray(q.correctAnswer) || !q.correctAnswer.length) {
          const correct = q.pairs.map((_, i) => `L${i}:R${i}`)
          next = { ...next, correctAnswer: correct }
        }
      }
      return next
    })
  }, [questionsData])

  const value = useMemo(() => {
    const nextQuestion = () => dispatch({ type: 'NEXT_QUESTION' })
    const prevQuestion = () => dispatch({ type: 'PREV_QUESTION' })
    const toggleShowAnswer = () => dispatch({ type: 'TOGGLE_SHOW_ANSWER' })

    const setPractice = (category, list) => {
      dispatch({ type: 'SET_MODE', payload: 'practice' })
      dispatch({ type: 'SET_CATEGORY', payload: category })
      dispatch({ type: 'SET_PRACTICE_QUESTIONS', payload: list })
    }

    const startExam = (list, settings) => {
      dispatch({ type: 'SET_MODE', payload: 'exam' })
      if (settings) dispatch({ type: 'SET_EXAM_SETTINGS', payload: settings })
      dispatch({ type: 'SET_EXAM_QUESTIONS', payload: list })
    }

    const answerQuestion = (questionId, answerArr) => {
      dispatch({ type: 'ANSWER_QUESTION', payload: { questionId, answer: answerArr } })
    }

    const calculateScore = () => {
      // Compute weighted raw score and scale to 1000; pass threshold default 800
      return scoreExam(state.examQuestions, state.userAnswers, DEFAULT_PASSING_SCORE)
    }

    const submitExam = () => {
      // in a more complex app, we might persist results
      return calculateScore()
    }

    return {
      state,
      questionsData: processedQuestions,
      nextQuestion,
      prevQuestion,
      toggleShowAnswer,
      setPractice,
      startExam,
      answerQuestion,
      submitExam,
      calculateScore,
    }
  }, [state, processedQuestions])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

function arraysEqualIgnoreOrder(a = [], b = []) {
  if (a.length !== b.length) return false
  const sa = [...a].sort()
  const sb = [...b].sort()
  return sa.every((v, i) => v === sb[i])
}
