import { Link } from 'react-router'
import { GraduationCap, ClipboardList } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-xl w-full px-6 py-10 text-center">
        <h1 className="text-3xl font-bold mb-6">CCNA 200-301 Study</h1>
        <p className="text-gray-600 mb-10">Choose a mode to begin</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/practice" className="group rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition">
            <div className="flex items-center justify-center gap-3">
              <GraduationCap className="text-blue-600" />
              <span className="font-medium">Practice</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">Learn by category with explanations</p>
          </Link>
          <Link to="/exam" className="group rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition">
            <div className="flex items-center justify-center gap-3">
              <ClipboardList className="text-emerald-600" />
              <span className="font-medium">Exam Simulation</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">Timed exam-like experience</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
