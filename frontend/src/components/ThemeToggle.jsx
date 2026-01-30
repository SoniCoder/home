import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { cn } from '../utils/cn'

export default function ThemeToggle({ className }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'p-2 rounded-lg transition-colors',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'text-gray-600 dark:text-gray-400',
        className
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  )
}
