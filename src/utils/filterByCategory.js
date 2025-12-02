export default function filterByCategory(questions = [], category = '') {
  if (!category) return questions
  return questions.filter(q => q.category === category)
}
