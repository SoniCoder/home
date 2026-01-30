import { LogOut } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import WelcomeBanner from '../components/WelcomeBanner'
import AppGrid from '../components/AppGrid'
import { useAuth } from '../contexts/AuthContext'

export default function HomePage() {
  const { user } = useAuth()

  const handleLogout = () => {
    // Redirect to ID service for logout
    window.location.href = '/id/logout'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Shizuha
              </span>
            </div>

            {/* User menu */}
            <div className="flex items-center gap-4">
              <ThemeToggle />

              {/* User info */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.first_name || user?.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                  <span className="text-brand-700 dark:text-brand-300 font-medium">
                    {(user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <WelcomeBanner />
        <AppGrid />

        {/* Quick stats placeholder for future */}
        {/*
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="card">
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Recent activity will appear here
            </p>
          </div>
        </section>
        */}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500 dark:text-gray-500">
          {new Date().getFullYear()} Shizuha. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
