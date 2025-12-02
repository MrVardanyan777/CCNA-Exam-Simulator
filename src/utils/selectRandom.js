export default function selectRandom(arr = [], count = 1) {
  const a = [...arr]
  const result = []
  while (a.length && result.length < count) {
    const idx = Math.floor(Math.random() * a.length)
    result.push(a.splice(idx, 1)[0])
  }
  return result
}
