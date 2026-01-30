import { useAuth } from '../contexts/AuthContext'

export default function WelcomeBanner() {
  const { user } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const displayName = user?.first_name || user?.username || 'there'

  return (
    <div className="mb-8 animate-fade-in">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {getGreeting()}, {displayName}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        What would you like to work on today?
      </p>
    </div>
  )
}
