import {
  HeartPulse,
  StickyNote,
  BookOpen,
  Package,
  Mail,
  Cloud,
} from 'lucide-react'
import { cn } from '../utils/cn'

const ICON_MAP = {
  HeartPulse,
  StickyNote,
  BookOpen,
  Package,
  Mail,
  Cloud,
}

export default function ProductCard({ product, isAuthenticated = false }) {
  const IconComponent = ICON_MAP[product.icon]

  const handleClick = () => {
    if (isAuthenticated) {
      window.location.href = product.path
    } else {
      window.location.href = `/id/login?continue=${encodeURIComponent(product.path)}`
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'group relative p-6 rounded-2xl text-left transition-all duration-300',
        'bg-white dark:bg-gray-900',
        'border border-gray-200 dark:border-gray-800',
        'hover:border-brand-300 dark:hover:border-brand-700',
        'hover:shadow-lg hover:shadow-brand-500/10 dark:hover:shadow-brand-500/5',
        'hover:-translate-y-1',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950'
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
          'transition-transform duration-300 group-hover:scale-110',
          product.bgColor
        )}
      >
        <IconComponent className="h-7 w-7 text-white" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {product.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {product.description}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-500">
        {product.tagline}
      </p>

      {/* Hover indicator */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-brand-600 dark:text-brand-400 text-sm font-medium">
          {isAuthenticated ? 'Open' : 'Learn more'} →
        </span>
      </div>
    </button>
  )
}
