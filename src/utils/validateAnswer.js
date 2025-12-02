export default function validateAnswer(given = [], correct = []) {
  if (!Array.isArray(given) || !Array.isArray(correct)) return false
  if (given.length !== correct.length) return false
  const g = [...given].sort()
  const c = [...correct].sort()
  return g.every((v, i) => v === c[i])
}
