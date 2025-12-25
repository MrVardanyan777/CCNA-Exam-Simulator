import { Analytics } from '@vercel/analytics/react'
import AppRouter from './router/AppRouter.jsx'

function App() {
  return (
    <>
      <AppRouter />
      <Analytics />
    </>
  )
}

export default App
