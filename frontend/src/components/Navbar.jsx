import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { cn } from '../utils/cn'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Shizuha
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#products"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Products
            </a>
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Features
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/id/login"
              className="btn-ghost"
            >
              Sign in
            </a>
            <a
              href="/id/register"
              className="btn-primary"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            <a
              href="#products"
              className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </a>
            <a
              href="#features"
              className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <hr className="border-gray-200 dark:border-gray-800" />
            <a
              href="/id/login"
              className="block w-full btn-ghost text-center"
            >
              Sign in
            </a>
            <a
              href="/id/register"
              className="block w-full btn-primary text-center"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
