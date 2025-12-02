import { createBrowserRouter, RouterProvider } from 'react-router'
import { AppProvider } from '../context/AppContext.jsx'
import Home from '../screens/Home.jsx'
import PracticeHome from '../features/practice/pages/PracticeHome.jsx'
import LearnMode from '../features/practice/pages/LearnMode.jsx'
import ExamSetup from '../features/exam/pages/ExamSetup.jsx'
import ExamMode from '../features/exam/pages/ExamMode.jsx'
import ExamReview from '../features/exam/pages/ExamReview.jsx'
import ExamResult from '../features/exam/pages/ExamResult.jsx'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/practice', element: <PracticeHome /> },
  { path: '/practice/:category', element: <LearnMode /> },
  { path: '/exam', element: <ExamSetup /> },
  { path: '/exam/start', element: <ExamMode /> },
  { path: '/exam/review', element: <ExamReview /> },
  { path: '/exam/result', element: <ExamResult /> },
])

export default function AppRouter() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  )
}
