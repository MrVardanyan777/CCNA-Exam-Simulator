import validateAnswer from './validateAnswer.js'

// Default weights per question type
// You can tweak these values to rebalance the exam
export const QUESTION_WEIGHTS = {
  'multiple-choice:single': 1.0,
  'multiple-choice:multi': 1.5,
  'drag-drop': 2.5,
  'simple': 1.0,
}

export const DEFAULT_PASSING_SCORE = 800 // on a 0–1000 scale

function getWeight(q) {
  if (!q) return 1
  if (q.type === 'drag-drop') return QUESTION_WEIGHTS['drag-drop']
  if (q.type === 'simple') return QUESTION_WEIGHTS['simple']
  // Treat multiple-choice with multiple correct answers as heavier
  const isMulti = Array.isArray(q.correctAnswer) && q.correctAnswer.length > 1
  return isMulti ? QUESTION_WEIGHTS['multiple-choice:multi'] : QUESTION_WEIGHTS['multiple-choice:single']
}

// Returns an object with both raw and scaled scoring results
// questions: array of question objects used in the exam
// userAnswers: map { [id]: string[] }
// passingScore: number (0..1000), default 800
export default function scoreExam(questions = [], userAnswers = {}, passingScore = DEFAULT_PASSING_SCORE) {
  let correct = 0
  let rawPoints = 0
  let maxPoints = 0

  for (const q of questions) {
    const weight = getWeight(q)
    maxPoints += weight
    const given = userAnswers[q.id] || []
    const expected = q.correctAnswer || []
    if (validateAnswer(given, expected)) {
      correct += 1
      rawPoints += weight
    }
  }

  const total = questions.length || 0
  const percent = total ? Math.round((correct / total) * 100) : 0
  const scaledScore = maxPoints > 0 ? Math.round((rawPoints / maxPoints) * 1000) : 0
  const passed = scaledScore >= passingScore

  return { correct, total, percent, rawPoints, maxPoints, scaledScore, passed, passingScore }
}
