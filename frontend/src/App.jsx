import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin dark:border-brand-800 dark:border-t-brand-400" />
        <span className="text-gray-500 dark:text-gray-400">Loading...</span>
      </div>
    </div>
  )
}

function ConditionalHome() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return isAuthenticated ? <HomePage /> : <LandingPage />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ConditionalHome />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
